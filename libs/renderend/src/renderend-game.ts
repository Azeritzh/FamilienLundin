import { GameRunner } from "@lundin/age"
import { WebGl2Display } from "@lundin/web-gl-display"
import { defaultDisplayConfig } from "./defaults"
import { DisplayConfig } from "./display/display-config"
import { ScreenSize } from "./display/display-state"
import { Renderend } from "./renderend"
import { RenderendDisplay } from "./renderend-display"
import { RenderendAction, StartGameAction } from "./state/renderend-action"
import { KeyStates } from "@lundin/utility"
import * as gameConfig from "./game-config.json"
import { RenderendConfig } from "./config/renderend-config"

export class RenderendGame extends GameRunner<RenderendAction> {
	constructor(
		hostElement: HTMLElement,
		private renderendDisplay: RenderendDisplay,
		private displayProvider: DisplayProvider,
		game: Renderend,
		updatesPerSecond = 60,
		private resizeObserver = new ResizeObserver(() => this.setSize(hostElement.clientWidth, hostElement.clientHeight)),
	) {
		super(renderendDisplay, game, updatesPerSecond)
		this.resizeObserver.observe(hostElement)
		this.actions.push(new StartGameAction)
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		displayConfig = { ...defaultDisplayConfig, ...displayConfig }
		const renderend = new Renderend(RenderendConfig.read(gameConfig))
		const displayProvider = new DisplayProvider(hostElement, displayConfig)
		const display = new RenderendDisplay(displayConfig, renderend, displayProvider)
		return new RenderendGame(hostElement, display, displayProvider, renderend)
	}

	setSize(width: number, height: number) {
		this.renderendDisplay.setSize(width, height)
		this.displayProvider.setSize(width, height)
	}

	onDestroy() {
		this.resizeObserver.disconnect()
	}
}

export class DisplayProvider {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private size: ScreenSize
	private textElements: { [index: string]: HTMLDivElement } = {}
	private keyStates = new KeyStates()

	constructor(
		private hostElement: HTMLElement,
		private config: DisplayConfig,
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
			this.display.addSprite(name, this.config.assetFolder + sprite.url, sprite.width, sprite.height, sprite.centerX, sprite.centerY)
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
		return this.keyStates.isPressed[input] ? 1 : 0
	}

	setSize(width: number, height: number) {
		this.size.updateHostSize(width, height)
		this.canvas.width = this.size.canvasWidth
		this.canvas.height = this.size.canvasHeight
		this.initialiseDisplay()
	}
}