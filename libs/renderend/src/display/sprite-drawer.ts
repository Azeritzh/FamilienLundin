import { Vector2 } from "@lundin/utility"
import { Renderend } from "../renderend"
import { DisplayProvider } from "../renderend-game"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

export class SpriteDrawer {
	constructor(
		private game: Renderend,
		private displayProvider: DisplayProvider,
		private config: DisplayConfig,
		private state: DisplayState,
	) { }
	public drawSprite(sprite: string, position: Vector2, velocity: Vector2 = null, animationStart = 0) {
		if (velocity)
			position = position.add(velocity.multiply(this.state.fractionOfTick))
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
