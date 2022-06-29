import { KeyStates } from "@lundin/utility"
import { WebGl2Display } from "@lundin/web-gl-display"
import { BaseDisplayConfig } from "./base-display-config"
import { ScreenSize } from "./screen-size"

export interface DisplayProvider {
	startFrame()
	drawSprite(name: string, x: number, y: number, frameX: number, frameY: number)
	endFrame()
	drawString(text: string, x: number, y: number, font: string, fontSize: number, color?: string)
	getInputState(input: string): number
	setSize(width: number, height: number)
}

export class HtmlDisplayProvider implements DisplayProvider {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private size: ScreenSize
	private textElements: { [index: string]: HTMLDivElement } = {}
	private keyStates = new KeyStates()

	constructor(
		private hostElement: HTMLElement,
		private config: BaseDisplayConfig,
	) {
		this.size = new ScreenSize(
			config.renderToVirtualSize,
			config.virtualPixelsPerTile,
			100,
			100,
			config.virtualHeight,
			config.virtualHeight,
		)
		this.initialiseCanvas()
		this.initialiseDisplay()
	}

	private initialiseCanvas() {
		this.hostElement.style.position = "relative"
		this.canvas = document.createElement("canvas")
		this.canvas.style.position = "absolute"
		if (this.config.renderToVirtualSize) {
			this.canvas.style.width = "100%"
			this.canvas.style.imageRendering = "pixelated"
		}
		this.hostElement.appendChild(this.canvas)
	}

	private initialiseDisplay() {
		this.display = new WebGl2Display(
			this.canvas,
			this.config.virtualPixelsPerTile,
			this.config.virtualHeight,
			this.config.renderToVirtualSize,
		)
		for (const [name, sprite] of Object.entries(this.config.sprites))
			this.display.addSprite(name, this.config.assetFolder + sprite.path + ".png", sprite.width, sprite.height, sprite.centerX, sprite.centerY)
	}

	public startFrame() {
		this.display.startFrame()
		this.updateTextElements()
	}

	private updateTextElements() {
		for (const key in this.textElements)
			if (this.textElements[key].style.display === "none")
				this.removeElement(key)
			else
				this.textElements[key].style.display = "none"
	}

	private removeElement(key: string) {
		const element = this.textElements[key]
		this.hostElement.removeChild(element)
		delete this.textElements[key]
	}

	public drawSprite(name: string, x: number, y: number, frameX: number, frameY: number) {
		if (this.display.isLoading())
			return
		this.display.drawSprite(name, x, y, frameX, frameY)
	}

	public endFrame() {
		this.display.endFrame()
	}

	public drawString(text: string, x: number, y: number, font: string, fontSize: number, color = "white") {
		const textElement = this.getTextElement(x, y, font, color, fontSize)
		textElement.innerText = text
		textElement.style.display = "block"
	}

	private getTextElement(x: number, y: number, font: string, color: string, fontSize: number) {
		const key = x + "," + y + font + color + fontSize
		if (!this.textElements[key])
			this.textElements[key] = this.createTextElement(x, y, font, color, fontSize)
		return this.textElements[key]
	}

	private createTextElement(x: number, y: number, font: string, color: string, fontSize: number) {
		const element = document.createElement("div")
		element.style.position = "absolute"
		element.style.fontFamily = `'${font}', Courier, monospace`
		element.style.fontWeight = "bold"

		element.style.display = "none"
		element.style.backgroundColor = "rgba(0,0,0,0.5)"
		element.style.textAlign = "center"
		element.style.color = color
		const width = 6
		element.style.left = (this.size.hostPixelsPerTile * (x - (width / 2))) + "px"
		element.style.top = (this.size.hostPixelsPerTile * y) + "px"
		element.style.fontSize = (this.size.hostPixelsPerTile * fontSize) + "px"
		element.style.width = (this.size.hostPixelsPerTile * width) + "px"
		element.style.lineHeight = (this.size.hostPixelsPerTile * fontSize * 2) + "px"

		this.hostElement.appendChild(element)
		return element
	}

	getInputState(input: string) {
		input = this.translateInputString(input)
		const state = this.keyStates.getInputState(input)
		switch (input) {
			case "MouseX": return this.modifyMouseX(state)
			case "MouseY": return this.modifyMouseY(state)
			default: return state
		}
	}

	private modifyMouseX(x: number) {
		const box = this.hostElement.getBoundingClientRect()
		return (x - box.x) / box.width
	}

	private modifyMouseY(y: number) {
		const box = this.hostElement.getBoundingClientRect()
		return (y - box.y) / box.height
	}

	private translateInputString(input: string) {
		if (input.length === 1)
			return "Key" + input
		switch (input) {
			case "Up": return "ArrowUp"
			case "Down": return "ArrowDown"
			case "Left": return "ArrowLeft"
			case "Right": return "ArrowRight"
			case "LeftShift": return "ShiftLeft"
		}
		return input
	}

	setSize(width: number, height: number) {
		this.size.updateHostSize(width, height)
		this.canvas.width = this.size.canvasWidth
		this.canvas.height = this.size.canvasHeight
		this.initialiseDisplay()
	}
}