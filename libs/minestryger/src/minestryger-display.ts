import { BaseDisplay } from "@lundin/age"
import { defaultDisplayConfig } from "./defaults"
import { Minestryger } from "./minestryger"
import { Field } from "./minestryger-state"

export class MinestrygerDisplay implements BaseDisplay {
	public canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	public textElements: { [index: string]: HTMLElement } = {}
	private timerId: number
	public fieldSize = 20

	constructor(
		public game: Minestryger,
		private hostElement: HTMLElement,
		public config: DisplayConfig = defaultDisplayConfig,
	) {
		this.initialiseCanvas()
		this.updateSize()
	}

	private initialiseCanvas() {
		this.hostElement.className = "game-host"
		this.canvas = document.createElement("canvas")
		this.context = this.canvas.getContext("2d")
		const style = document.createElement("style")
		style.innerText = this.config.styling
		this.hostElement.appendChild(this.canvas)
		this.hostElement.appendChild(style)
		this.setupElements()
		this.timerId = window.setInterval(this.updateTimeElement, 500)
	}

	private setupElements() {
		this.setupTimeText()
		this.setupBombsText()
		this.setupNewGameButton()
	}

	private setupTimeText() {
		const element = this.getElement("time")
		element.className = "time"
	}

	private setupBombsText() {
		const element = this.getElement("bombs")
		element.className = "bombs"
	}

	private setupNewGameButton() {
		const element = this.getElement("button", "button")
		element.innerText = this.config.newGameText
	}

	private getElement(key: string, tag = "div") {
		if (!this.textElements[key])
			this.textElements[key] = this.createElement(tag)
		return this.textElements[key]
	}

	private createElement(tag: string) {
		const element = document.createElement(tag)
		this.canvas.parentElement.appendChild(element)
		return element
	}

	private updateTimeElement = () => {
		const element = this.getElement("time")
		element.innerText = "" + Math.floor(this.getCurrentTime())
	}

	private getCurrentTime() {
		if (this.game.state.finishTime !== null)
			return this.game.state.finishTime / 1000
		else if (this.game.state.startTime)
			return (Date.now() - this.game.state.startTime) / 1000
		else
			return 0
	}

	onDestroy() {
		window.clearInterval(this.timerId)
	}

	updateSize() {
		this.fieldSize = this.config.useAvailableSize
			? this.availableFieldSize()
			: this.config.defaultFieldSize
		this.canvas.width = this.fieldSize * this.game.config.width
		this.canvas.height = this.fieldSize * this.game.config.height
	}

	private availableFieldSize() {
		const horisontalFields = Math.max(this.game.config.width, 30) // make size for at least the expert version
		const verticalFields = Math.max(this.game.config.height, 16) // make size for at least the expert version
		const horisontalFieldSize = Math.floor(this.hostElement.clientWidth / horisontalFields)
		const verticalFieldSize = Math.floor(this.hostElement.clientHeight / verticalFields)
		return Math.min(horisontalFieldSize, verticalFieldSize)
	}

	setSize() {
		throw new Error("Method not implemented.")
	}

	show() {
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.countRemainingBombs()
		this.updateTimeElement()
		for (const { x, y } of this.game.state.board.allFields())
			this.drawField(x, y)
	}

	private countRemainingBombs() {
		const element = this.getElement("bombs")
		const lockedFields = [...this.game.state.board.allFields()]
			.map(x => x.field)
			.filter(x => x.locked)
			.length
		element.innerText = "" + (this.game.config.bombs - lockedFields)
	}

	drawField(x: number, y: number, hover = false) {
		if (!this.game.state.board.isWithinBounds(x, y))
			return
		const field = this.game.state.board.get(x, y)
		this.drawSprite(this.getSprite(field, hover), x, y)
	}

	private getSprite(field: Field, hover = false) {
		if (field.revealed)
			return field.bomb
				? this.config.sprites.bomb
				: this.config.sprites[field.surroundingBombs.toString()]
		if (field.locked)
			return hover
				? this.config.sprites["flag-hover"]
				: this.config.sprites.flag
		return hover
			? this.config.sprites["hidden-hover"]
			: this.config.sprites.hidden
	}

	drawSprite(sprite: Sprite, x: number, y: number) {
		const fontScale = sprite.fontScale ?? 0.8
		const fontWeight = sprite.fontWeight ?? "bold"
		const font = sprite.font ?? "arial"
		this.drawBox(x, y,
			sprite.text ?? "",
			sprite.color ?? "white",
			sprite.textcolor ?? "black",
			fontWeight + " " + (this.fieldSize * fontScale) + "px " + font
		)
	}

	private drawBox(
		x: number,
		y: number,
		text: string,
		color: string,
		textcolor: string,
		textfont: string
	) {
		this.context.fillStyle = color
		this.context.fillRect(this.fieldSize * x + 1, this.fieldSize * y + 1, this.fieldSize - 2, this.fieldSize - 2)
		this.context.fillStyle = textcolor
		this.context.font = textfont
		this.context.textAlign = "center"
		this.context.fillText(text, (this.fieldSize) * x + 0.5 * this.fieldSize, (this.fieldSize) * y + 0.80 * this.fieldSize)
	}
}

export interface DisplayConfig {
	defaultFieldSize: number
	useAvailableSize: boolean
	newGameText: string
	sprites: {
		[name: string]: Sprite
	}
	styling: string
}

interface Sprite {
	text?: string
	color?: string
	textcolor?: string
	fontScale?: number
	fontWeight?: string
	font?: string
}