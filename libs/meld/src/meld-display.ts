import { BaseDisplay, HtmlDisplayProvider, Id, typeOf } from "@lundin/age"
import { Meld } from "./meld"
import { MeldInput } from "./meld-input"
import { Block } from "./state/block"
import { MeldAction } from "./state/meld-action"

export class MeldDisplay implements BaseDisplay<MeldAction> {
	private fractionOfTick = 0
	private input: MeldInput

	constructor(
		private config: DisplayConfig,
		private game: Meld,
		private display: HtmlDisplayProvider,
	) {
		this.input = new MeldInput(this.display.canvas)
	}

	setSize(width: number, height: number) { 
		console.log(width, height)
	}

	show(fractionOfTick = 0) {
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
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
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