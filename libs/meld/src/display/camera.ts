import { DisplayProvider, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

export class Camera {
	constructor(
		private game: Meld,
		private displayProvider: DisplayProvider,
		private config: DisplayConfig,
		private state: DisplayState,
	) { }

	public focusOn(entity: Id) {
		this.state.focusPoint = this.currentPositionFrom(
			this.game.entities.position.get.of(entity) ?? new Vector3(0, 0, 0),
			this.game.entities.velocity.get.of(entity),
		)
	}

	private currentPositionFrom(position: Vector3, velocity: Vector3 = null) {
		return velocity
			? position.add(velocity.multiply(this.state.fractionOfTick))
			: position
	}

	public draw(sprite: string, position: Vector3, velocity: Vector3 = null, animationStart = 0) {
		position = this.calculateSpritePosition(position, velocity)
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

	private calculateSpritePosition(position: Vector3, velocity: Vector3 = null) {
		return this.currentPositionFrom(position, velocity)
			.add(new Vector3(this.state.size.widthInTiles / 2, this.state.size.heightInTiles / 2, 0))
			.subtract(this.state.focusPoint)
	}

	public tilePositionFor(x: number, y: number) {
		return new Vector3(x * this.state.size.widthInTiles, y * this.state.size.heightInTiles, 0)
			.add(this.topLeftCornerPosition())
	}

	private topLeftCornerPosition() {
		return this.state.focusPoint.subtract(new Vector3(this.state.size.widthInTiles / 2, this.state.size.heightInTiles / 2, 0))
	}
}
