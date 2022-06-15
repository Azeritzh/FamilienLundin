import { BaseDisplay } from "@lundin/age"
import { Minestryger } from "./minestryger"
import { Field } from "./minestryger-state"

export class MinestrygerDisplay implements BaseDisplay {
	// public width = 30
	// public height = 16
	//public bombs = 99
	//public allowFlags = true
	//public activateOnMouseDown = false
	//@Input("fieldSize") inputFieldSize = 20
	private fieldSize = 20

	public canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	public textElements: { [index: string]: HTMLElement } = {}
	private timerId: number
	// private display: WebGl2Display
	//private readonly gameHeightInTiles = 10
	//private get gameWidthInTiles() { return this.canvas.width / this.screenPixelsPerTile }
	//private readonly gamePixelsPerTile = 16
	//private screenPixelsPerTile = 100

	constructor(
		public game: Minestryger,
		private hostElement: HTMLElement,
	) {
		this.initialiseCanvas()
		this.setSize(hostElement.clientWidth, hostElement.clientHeight)
		new ResizeObserver(() => {
			this.setSize(hostElement.clientWidth, hostElement.clientHeight)
			this.show()
		}).observe(hostElement)
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
		element.innerText = "New Game"
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
		this.fieldSize = Math.min(horisontalFieldSize, verticalFieldSize)
		this.fieldSize = Math.max(this.fieldSize, 15)
		this.canvas.width = this.fieldSize * horisontalFields
		this.canvas.height = this.fieldSize * verticalFields
	}

	show() {
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.countRemainingBombs()
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
		const sprite = this.getSprite(field, hover)
		this.drawBox(x, y, sprite.text, sprite.color, sprite.textcolor, sprite.textfont)
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
			text: "",
			color: "grey",
			textcolor: "black",
			textfont: "bold 10px arial",
		},
		"hidden-hover": {
			text: "",
			color: "lightgrey",
			textcolor: "black",
			textfont: "bold 10px arial",
		},
		flag: {
			text: "⚑",
			color: "grey",
			textcolor: "red",
			textfont: "10px serif",
		},
		"flag-hover": {
			text: "⚑",
			color: "lightgrey",
			textcolor: "red",
			textfont: "10px serif",
		},
		bomb: {
			text: "💣",
			color: "red",
			textcolor: "black",
			textfont: "bold 10px arial",
		},
		"0": {
			text: "",
			color: "white",
			textcolor: "black",
			textfont: "bold 10px arial",
		},
		"1": {
			text: "1",
			color: "white",
			textcolor: "#0100fe",
			textfont: "bold 10px arial",
		},
		"2": {
			text: "2",
			color: "white",
			textcolor: "#017f01",
			textfont: "bold 10px arial",
		},
		"3": {
			text: "3",
			color: "white",
			textcolor: "#fe0000",
			textfont: "bold 10px arial",
		},
		"4": {
			text: "4",
			color: "white",
			textcolor: "#010080",
			textfont: "bold 10px arial",
		},
		"5": {
			text: "5",
			color: "white",
			textcolor: "#810102",
			textfont: "bold 10px arial",
		},
		"6": {
			text: "6",
			color: "white",
			textcolor: "#008081",
			textfont: "bold 10px arial",
		},
		"7": {
			text: "7",
			color: "white",
			textcolor: "#000000",
			textfont: "bold 10px arial",
		},
		"8": {
			text: "8",
			color: "white",
			textcolor: "#808080",
			textfont: "bold 10px arial",
		},
	},
}

export interface DisplayConfig {
	sprites: {
		[name: string]: {
			text: string,
			color: string,
			textcolor: string,
			textfont: string,
		}
	}
}