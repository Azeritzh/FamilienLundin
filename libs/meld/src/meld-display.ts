import { BaseDisplay, HtmlDisplayProvider, Id, typeOf } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { DisplayConfig } from "./display/display-config"
import { DisplayState } from "./display/display-state"
import { InputParser } from "./display/input-parser"
import { Camera } from "./display/camera"
import { Meld } from "./meld"
import { Block } from "./state/block"
import { MeldAction } from "./state/meld-action"

export class MeldDisplay implements BaseDisplay<MeldAction> {
	constructor(
		private config: DisplayConfig,
		private game: Meld,
		private display: HtmlDisplayProvider,
		private state = DisplayState.from(config),
		private camera = new Camera(game, display, config, state),
		private inputParser = new InputParser(camera, display, config.inputs),
	) { }

	setSize(width: number, height: number) {
		this.state.size.updateHostSize(width, height)
	}

	show(fractionOfTick = 0) {
		this.state.fractionOfTick = fractionOfTick
		const firstEntity = [...this.game.entities.with.position.keys()][0]
		this.camera.focusOn(firstEntity)
		this.display.startFrame()
		for (const { x, y, z, field } of this.game.terrain.allFields())
			this.drawBlock(x, y, z, field)
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
	}

	private drawEntity(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.camera.draw(sprite, position, velocity)
	}

	private drawBlock(x: number, y: number, z: number, block: Block) {
		if (z !== 0)
			return
		const sprite = this.game.config.typeMap.typeFor(block.solidType) ?? "obstacle"
		this.camera.draw(sprite, new Vector3(x, y, z))
	}

	getNewActions() {
		return this.inputParser.parseInputs()
	}
}
