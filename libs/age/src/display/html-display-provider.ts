import { KeyStates, Vector3 } from "@lundin/utility"
import { WebGl2Display } from "@lundin/web-gl-display"
import { BaseDisplayConfig } from "./base-display-config"
import { ScreenSize } from "./screen-size"

export interface DisplayProvider {
	SortByDepth: boolean
	StartNewFrame(): void
	Draw(name: string, x: number, y: number, frameX: number, frameY: number, depth?: number, rotation?: number, color?: Vector3, alpha?: number): void
	DrawString(text: string, x: number, y: number, font: string, fontSize: number, color?: string): void
	FinishFrame(): void
	GetInputState(input: string): number
	endInputFrame(): void
	setSize(width: number, height: number): void
}

export class HtmlDisplayProvider implements DisplayProvider {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private size: ScreenSize
	private textElements: { [index: string]: HTMLDivElement } = {}
	private keyStates = new KeyStates()
	get SortByDepth() { return this.display.sortByDepth }
	set SortByDepth(value: boolean) { this.display.sortByDepth = value }

	constructor(
		private hostElement: HTMLElement,
		private config: BaseDisplayConfig,
	) {
		this.size = new ScreenSize(
			config.RenderToVirtualSize,
			config.VirtualPixelsPerTile,
			100,
			100,
			config.VirtualHeight,
			config.VirtualHeight,
		)
		this.initialiseCanvas()
		this.initialiseDisplay()
	}

	private initialiseCanvas() {
		this.hostElement.style.position = "relative"
		this.hostElement.style.backgroundColor = "black"
		this.canvas = document.createElement("canvas")
		this.canvas.style.position = "absolute"
		if (this.config.RenderToVirtualSize) {
			this.canvas.style.width = "100%"
			this.canvas.style.imageRendering = "pixelated"
		}
		this.hostElement.appendChild(this.canvas)
	}

	private initialiseDisplay() {
		const sortByDepth = this.display?.sortByDepth ?? false
		this.display = new WebGl2Display(
			this.canvas,
			this.config.VirtualPixelsPerTile,
			this.config.VirtualHeight,
			this.config.RenderToVirtualSize,
		)
		this.display.sortByDepth = sortByDepth
		for (const [name, sprite] of Object.entries(this.config.Sprites))
			this.display.addSprite(name, this.config.AssetFolder + sprite.path + ".png", sprite.width, sprite.height, sprite.centerX, sprite.centerY, sprite.offsetX, sprite.offsetY)
	}

	public StartNewFrame() {
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

	public Draw(name: string, x: number, y: number, frameX: number, frameY: number, depth = 1, rotation?: number, color?: Vector3, alpha?: number) {
		if (this.display.isLoading())
			return
		this.display.draw(name, x, y, frameX, frameY, depth, rotation, color, alpha)
	}

	public FinishFrame() {
		this.display.endFrame()
	}

	public DrawString(text: string, x: number, y: number, font: string, fontSize: number, color = "white") {
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
		element.style.left = (this.size.HostPixelsPerTile * (x - (width / 2))) + "px"
		element.style.top = (this.size.HostPixelsPerTile * y) + "px"
		element.style.fontSize = (this.size.HostPixelsPerTile * fontSize) + "px"
		element.style.width = (this.size.HostPixelsPerTile * width) + "px"
		element.style.lineHeight = (this.size.HostPixelsPerTile * fontSize * 2) + "px"

		this.hostElement.appendChild(element)
		return element
	}

	GetInputState(input: string) {
		const state = this.keyStates.getInputState(input)
		switch (input) {
			case "MouseX": return this.modifyMouseX(state)
			case "MouseY": return this.modifyMouseY(state)
			default: return state
		}
	}

	endInputFrame() {
		this.keyStates.endInputFrame()
	}

	private modifyMouseX(x: number) {
		const box = this.hostElement.getBoundingClientRect()
		return (x - box.x) / box.width
	}

	private modifyMouseY(y: number) {
		const box = this.hostElement.getBoundingClientRect()
		return (y - box.y) / box.height
	}

	setSize(width: number, height: number) {
		this.size.UpdateHostSize(width, height)
		this.canvas.width = this.size.CanvasWidth
		this.canvas.height = this.size.CanvasHeight
		this.initialiseDisplay()
	}
}