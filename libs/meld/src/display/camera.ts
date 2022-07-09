import { DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

export class Camera {
	constructor(
		private game: Meld,
		private displayProvider: DisplayProvider,
		private config: DisplayConfig,
		private state: DisplayState,
		public shownLayers: { layer: number, area: DisplayArea }[] = []
	) { }

	get top() { return this.state.focusPoint.y - this.state.size.heightInTiles / 2 }
	get bottom() { return this.state.focusPoint.y + this.state.size.heightInTiles / 2 }
	get left() { return this.state.focusPoint.x - this.state.size.widthInTiles / 2 }
	get right() { return this.state.focusPoint.x + this.state.size.widthInTiles / 2 }

	public focusOn(entity: Id) {
		this.state.focusPoint = this.currentPositionFrom(
			this.game.entities.position.get.of(entity) ?? new Vector3(0, 0, 0),
			this.game.entities.velocity.get.of(entity),
		)
		this.updateShownLayers()
	}

	private updateShownLayers() {
		this.shownLayers.clear()
		for (let layer = -1; layer <= 1; layer++)
			this.shownLayers.push({ layer: layer + Math.floor(this.state.focusPoint.z), area: this.displayAreaFor(layer) })
	}

	private displayAreaFor(layer: number) {
		return new DisplayArea(
			this.top + layer * this.config.wallDisplayHeight,
			this.bottom + layer * this.config.wallDisplayHeight,
			this.left,
			this.right,
		)
	}

	private currentPositionFrom(position: Vector3, velocity: Vector3 = null) {
		return velocity
			? position.add(velocity.multiply(this.state.fractionOfTick))
			: position
	}

	drawAnimated(sprite: string, position: Vector3, velocity: Vector3 = null, animationStart = 0) {
		const config = this.config.sprites[sprite]
		const frame = this.animationFrame(config.frameInterval, config.framesX, config.framesY, animationStart)
		this.draw(sprite, position, velocity, frame)
	}

	private animationFrame(frameInterval: number, framesX: number, framesY: number, animationStart: number) {
		if (!frameInterval)
			return 0
		const numberOfFrames = framesX * framesY
		const tick = this.game.state.globals.tick - animationStart
		const frameIndex = Math.floor(tick / frameInterval) % numberOfFrames
		return frameIndex
	}

	drawVaried(sprite: string, position: Vector3, velocity: Vector3 = null, variation = 0) {
		const config = this.config.sprites[sprite]
		const sumOfWeights = config.frameWeights.sum()
		let frameIndex = 0
		let sum = 0
		for (const weight of config.frameWeights) {
			sum += weight
			if (sum > variation % sumOfWeights)
				break
			frameIndex++
		}
		this.draw(sprite, position, velocity, frameIndex)
	}

	draw(sprite: string, position: Vector3, velocity: Vector3 = null, frameIndex = 0) {
		const screenPosition = this.screenPositionFor(position, velocity)
		const config = this.config.sprites[sprite]
		const frameX = frameIndex % config.framesX
		const frameY = Math.floor(frameIndex / config.framesX) % config.framesY
		this.displayProvider.draw(sprite, screenPosition.x, screenPosition.y, frameX, frameY)
	}

	private screenPositionFor(position: Vector3, velocity: Vector3 = null) {
		const currentPosition = this.currentPositionFrom(position, velocity)
		return new Vector2(
			currentPosition.x - this.left,
			currentPosition.y - this.top - this.config.wallDisplayHeight * (currentPosition.z - this.state.focusPoint.z))
	}

	public tilePositionFor(x: number, y: number) {
		return new Vector3(x * this.state.size.widthInTiles, y * this.state.size.heightInTiles, 0)
			.add(new Vector3(this.left, this.top, 0))
	}
}

export class DisplayArea {
	constructor(
		public top: number,
		public bottom: number,
		public left: number,
		public right: number,
	) { }
}
