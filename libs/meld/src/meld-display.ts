import { BaseDisplay, Id, typeOf } from "@lundin/age"
import { WebGl2Display } from "@lundin/web-gl-display"
import { Meld } from "./meld"
import { MeldInput } from "./meld-input"
import { Block } from "./state/block"
import { MeldAction } from "./state/meld-action"

export class MeldDisplay implements BaseDisplay<MeldAction> {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private readonly gameHeightInTiles = 10
	private get gameWidthInTiles() { return this.canvas.width / this.screenPixelsPerTile }
	private readonly gamePixelsPerTile = 16
	private screenPixelsPerTile = 100
	private fractionOfTick = 0
	private input: MeldInput

	constructor(
		private config: DisplayConfig,
		private game: Meld,
		private hostElement: HTMLElement,
	) {
		this.initialiseCanvas()
		this.setupDisplay()
		this.input = new MeldInput(this.display.canvas)
	}

	private initialiseCanvas(){
		this.hostElement.style.position = "relative"
		this.canvas = document.createElement("canvas")
		this.canvas.style.position = "absolute"
		this.hostElement.appendChild(this.canvas)
	}

	private setupDisplay() {
		this.display = new WebGl2Display(this.canvas, this.gamePixelsPerTile, this.gameHeightInTiles * this.gamePixelsPerTile)
		for (const [name, sprite] of Object.entries(this.config.sprites))
			this.display.addSprite(name, sprite.url, sprite.width, sprite.height, sprite.centerX, sprite.centerY)
	}

	setSize(width: number, height: number) {
		this.canvas.width = width
		this.canvas.height = height
		this.screenPixelsPerTile = height / this.gameHeightInTiles
		this.setupDisplay()
	}

	show(fractionOfTick = 0) {
		if (this.display.isLoading())
			return
		this.fractionOfTick = fractionOfTick
		this.display.startFrame()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		for (const { x, y, z, field } of this.game.terrain.allFields())
			this.drawBlock(x, y, z, field)
		this.display.endFrame()
	}

	private drawEntity(entity: Id) {
		const pos = this.currentPositionOf(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.display.drawSprite(sprite, pos.x, pos.y, 0, 0)
	}

	private currentPositionOf(entity: Id) {
		const position = this.game.access.position.get.of(entity)
		const velocity = this.game.access.velocity.get.of(entity)
		if (!velocity)
			return position
		return position.add(velocity.multiply(this.fractionOfTick))
	}

	private drawBlock(x: number, y: number, z: number, block: Block) {
		const sprite = this.game.config.typeMap.typeFor(block.solidType) ?? "obstacle"
		this.display.drawSprite(sprite, x, y, 0, 0)
	}

	getNewActions() {
		return [] //this.input.parseInputs()
	}
}

export interface DisplayConfig {
	sprites: {
		[index: string]: {
			url: string,
			width?: number,
			height?: number,
			centerX?: number,
			centerY?: number,
		}
	}
}