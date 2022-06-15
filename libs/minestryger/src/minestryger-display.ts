import { BaseDisplay } from "@lundin/age"
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
		private newGameText = "New game",
	) {
		this.initialiseCanvas()
		this.setSize(hostElement.clientWidth, hostElement.clientHeight)
	}

	private initialiseCanvas() {
		this.hostElement.className = "game-host"
		this.canvas = document.createElement("canvas")
		this.context = this.canvas.getContext("2d")
		const style = document.createElement("style")
		style.innerText = `
.game-host {
	position: relative;
	display: grid;
	grid-template-areas: "game game game"
		"time button bombs";
	grid-template-rows: max-content 2rem;
	grid-template-columns: 3rem max-content 3rem;
	justify-content: center;
}

.game-host canvas { grid-area: game; }

.game-host .bombs, .game-host .time {
	width: 3rem;
	height: 2rem;
	text-align: center;
	line-height: 2rem;
	font-weight: bold;
	font-size: 1.2rem;
	color: red;
	background-color: black;
}

.game-host .time {
	grid-area: time;
}

.game-host .bombs {
	grid-area: bombs;
	margin-left: auto;
}

.game-host button {
	grid-area: button;
	border-radius: 0;
}
`
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
		element.innerText = this.newGameText
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

	setSize(width: number, height: number) {
		const horisontalFields = Math.max(this.game.config.width, 30) // make size for at least the expert version
		const verticalFields = Math.max(this.game.config.height, 16) // make size for at least the expert version
		const horisontalFieldSize = Math.floor(width / horisontalFields)
		const verticalFieldSize = Math.floor(height / verticalFields)
		const fieldSize = Math.min(horisontalFieldSize, verticalFieldSize)
		this.setFieldSize(Math.max(fieldSize, 15))
	}

	setFieldSize(fieldSize: number) {
		this.fieldSize = fieldSize
		this.canvas.width = this.fieldSize * this.game.config.width
		this.canvas.height = this.fieldSize * this.game.config.height
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
				? displayConfig.sprites.bomb
				: displayConfig.sprites[field.surroundingBombs.toString()]
		if (field.locked)
			return hover
				? displayConfig.sprites["flag-hover"]
				: displayConfig.sprites.flag
		return hover
			? displayConfig.sprites["hidden-hover"]
			: displayConfig.sprites.hidden
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

const displayConfig: DisplayConfig = {
	sprites: {
		hidden: {
			color: "grey",
		},
		"hidden-hover": {
			color: "lightgrey",
		},
		flag: {
			text: "⚑",
			color: "grey",
			textcolor: "red",
			font: "serif",
			fontWeight: "",
		},
		"flag-hover": {
			text: "⚑",
			color: "lightgrey",
			textcolor: "red",
			font: "serif",
			fontWeight: "",
		},
		bomb: {
			text: "💣",
			color: "red",
			font: "serif",
			fontWeight: "",
			fontScale: 0.6,
		},
		"0": {},
		"1": {
			text: "1",
			textcolor: "#0100fe",
		},
		"2": {
			text: "2",
			textcolor: "#017f01",
		},
		"3": {
			text: "3",
			textcolor: "#fe0000",
		},
		"4": {
			text: "4",
			textcolor: "#010080",
		},
		"5": {
			text: "5",
			textcolor: "#810102",
		},
		"6": {
			text: "6",
			textcolor: "#008081",
		},
		"7": {
			text: "7",
			textcolor: "#000000",
		},
		"8": {
			text: "8",
			textcolor: "#808080",
		},
	},
}

export interface DisplayConfig {
	sprites: {
		[name: string]: Sprite
	}
}

interface Sprite {
	text?: string
	color?: string
	textcolor?: string
	fontScale?: number
	fontWeight?: string
	font?: string
}