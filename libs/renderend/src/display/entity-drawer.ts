import { Id, typeOf } from "@lundin/age"
import { Renderend } from "../renderend"
import { WebGl2Display } from "@lundin/web-gl-display"
import { Vector2 } from "@lundin/utility"
import { DisplayConfig } from "../renderend-display"
import { DisplayState } from "./display-state"

export class EntityDrawer {
	constructor(
		private game: Renderend,
		public displayProvider: WebGl2Display,
		private config: DisplayConfig,
		private state: DisplayState,
	) { }

	drawEntities() {
		for (const entity of this.game.entities)
			this.drawEntity(entity)
	}

	private drawEntity(entity: Id) {
		if (typeOf(entity) === this.game.config.constants.shipType)
			this.drawShip(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.currentPositionOf(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.drawSprite(sprite, position)
	}

	private drawShip(entity: Id) {
		const position = this.currentPositionOf(entity)
		const shields = this.shieldSpriteFor(entity)
		if (shields)
			this.drawSprite(shields, position)
		this.drawSprite("ship", position)
	}

	private shieldSpriteFor(entity: Id) {
		switch (this.game.entities.health.get.of(entity)) {
			case 3: return "full-shield"
			case 2: return "half-shield"
		}
	}

	private currentPositionOf(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		if (!velocity)
			return position
		return position.add(velocity.multiply(this.state.fractionOfTick))
	}

	private drawSprite(sprite: string, position: Vector2, animationStart = 0) {
		const config = this.config.sprites[sprite]
		if (!config.frameInterval)
			return this.displayProvider.drawSprite(sprite, position.x, position.y, 0, 0)
		const width = config.framesX ?? 1
		const height = config.framesY ?? 1
		const numberOfFrames = width * height
		const tick = this.game.state.globals.tick - animationStart
		const frameIndex = Math.floor(tick / config.frameInterval) % numberOfFrames
		const frameX = frameIndex % width
		const frameY = Math.floor(frameIndex / width) % height
		this.displayProvider.drawSprite(sprite, position.x, position.y, frameX, frameY)
	}
}
