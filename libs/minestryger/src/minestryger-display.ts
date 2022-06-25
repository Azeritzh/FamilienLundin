import { defaultDisplayConfig } from "./defaults"
import { GameElements } from "./display/game-elements"
import { SettingsElements } from "./display/settings-elements"
import { Minestryger } from "./minestryger"
import { MinestrygerConfig } from "./minestryger-config"
import { Field } from "./minestryger-state"

export class MinestrygerDisplay {
	public canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	public state: DisplayState
	public elements: { [index: string]: HTMLElement } = {}
	private gameElements: GameElements
	private settingsElements: SettingsElements

	constructor(
		public game: Minestryger,
		private hostElement: HTMLElement,
		public config: DisplayConfig = defaultDisplayConfig,
	) {
		this.setupDisplayState()
		this.gameElements = new GameElements(game, config, this.elements)
		this.settingsElements = new SettingsElements(game, config, this.state,  this.elements)
		this.initialiseCanvas()
		this.updateSize()
	}

	setupDisplayState() {
		this.state = {
			fieldSize: 20,
			desiredConfig: { ...this.game.config },
			showAdvancedSettings: false,
		}
	}

	private initialiseCanvas() {
		this.hostElement.className = "game-host"
		this.hostElement.innerHTML = this.gameElements.getInitialElements() + this.settingsElements.getInitialElements()
		this.canvas = document.createElement("canvas")
		this.context = this.canvas.getContext("2d")
		this.hostElement.appendChild(this.canvas)
		const style = document.createElement("style")
		style.innerText = this.config.styling
		this.hostElement.appendChild(style)
		this.gameElements.initialise()
		this.settingsElements.initialise()
	}

	onDestroy() {
		this.gameElements.onDestroy()
	}

	updateGame(game: Minestryger) {
		this.game = game
		this.gameElements.game = game
		this.settingsElements.game = game
		this.updateSize()
	}

	updateSize() {
		this.state.fieldSize = this.config.useAvailableSize
			? this.availableFieldSize()
			: this.config.defaultFieldSize
		this.canvas.width = this.state.fieldSize * this.game.config.width
		this.canvas.height = this.state.fieldSize * this.game.config.height
		this.show()
	}

	private availableFieldSize() {
		const horisontalFields = Math.max(this.game.config.width, 30) // make size for at least the expert version
		const verticalFields = Math.max(this.game.config.height, 16) // make size for at least the expert version
		const horisontalFieldSize = Math.floor((this.hostElement.clientWidth - 250) / horisontalFields)
		const verticalFieldSize = Math.floor(this.hostElement.clientHeight / (verticalFields + 2))
		return Math.min(horisontalFieldSize, verticalFieldSize)
	}

	show() {
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.gameElements.show()
		this.settingsElements.show()
		for (const { x, y } of this.game.state.board.allFields())
			this.drawField(x, y)
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
			fontWeight + " " + (this.state.fieldSize * fontScale) + "px " + font
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
		this.context.fillRect(this.state.fieldSize * x + 1, this.state.fieldSize * y + 1, this.state.fieldSize - 2, this.state.fieldSize - 2)
		this.context.fillStyle = textcolor
		this.context.font = textfont
		this.context.textAlign = "center"
		this.context.fillText(text, (this.state.fieldSize) * x + 0.5 * this.state.fieldSize, (this.state.fieldSize) * y + 0.80 * this.state.fieldSize)
	}
}

export interface DisplayConfig {
	allowFlags: boolean
	defaultFieldSize: number
	useAvailableSize: boolean
	text: {
		newGame: string
		settings: string
		beginner: string
		intermediate: string
		expert: string
		allowFlags: string
		advancedSettings: string
		width: string
		height: string
		bombs: string
		earlyClick: string
		fieldSize: string
		autoSize: string
	}
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

export interface DisplayState {
	fieldSize: number
	desiredConfig: MinestrygerConfig
	showAdvancedSettings: boolean
}