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
		for (let layer = -this.config.displayDepth; layer <= this.config.displayDepth; layer++)
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

	drawAnimated(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, animationStart = 0) {
		const config = this.config.sprites[sprite]
		const frame = this.animationFrame(config.frameInterval, config.framesX, config.framesY, animationStart)
		this.draw(sprite, layer, position, velocity, frame)
	}

	private animationFrame(frameInterval: number, framesX: number, framesY: number, animationStart: number) {
		if (!frameInterval)
			return 0
		const numberOfFrames = framesX * framesY
		const tick = this.game.state.globals.tick - animationStart
		const frameIndex = Math.floor(tick / frameInterval) % numberOfFrames
		return frameIndex
	}

	drawVaried(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, variation = 0) {
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
		this.draw(sprite, layer, position, velocity, frameIndex)
	}

	draw(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, frameIndex = 0) {
		const currentPosition = this.currentPositionFrom(position, velocity)
		const screenPosition = this.screenPositionFor(currentPosition)
		const config = this.config.sprites[sprite]
		const frameX = frameIndex % config.framesX
		const frameY = Math.floor(frameIndex / config.framesX) % config.framesY
		this.displayProvider.draw(sprite, screenPosition.x, screenPosition.y, frameX, frameY, this.sortingNumberFor(currentPosition, layer))
	}

	private screenPositionFor(position: Vector3) {
		return new Vector2(
			position.x - this.left,
			position.y - this.top - this.config.wallDisplayHeight * (position.z - this.state.focusPoint.z))
	}

	private sortingNumberFor(position: Vector3, layer: number) {
		const z = Math.floor(position.z) + layer
		const rangeZ = (this.config.displayDepth * 2 + 3) // adding 3 rather than 1 just to be on the safe side
		const minZ = this.state.focusPoint.z - rangeZ / 2
		const normalisedZ = (z - minZ) / rangeZ

		const rangeY = this.state.size.heightInTiles + (this.config.displayDepth * 2 + 1) * this.config.wallDisplayHeight
		const minY = this.state.focusPoint.y - rangeY / 2
		const normalisedY = (position.y - minY) / rangeY
		const ySortingComponent = (normalisedY / Layer.NumberOfLayers) / rangeZ

		return normalisedZ + ySortingComponent
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

export class Layer {
	public static NumberOfLayers = 4
	public static Bottom = 0
	public static Floor = 1 / Layer.NumberOfLayers
	public static Middle = 2 / Layer.NumberOfLayers
	public static Top = 3 / Layer.NumberOfLayers
	public static ZFightingAdjustment = 0.0001
	public static OverlayNorthAdjustment = Layer.ZFightingAdjustment * 1
	public static OverlayEastAdjustment = Layer.ZFightingAdjustment * 2
	public static OverlayWestAdjustment = Layer.ZFightingAdjustment * 3
	public static OverlaySouthAdjustment = Layer.ZFightingAdjustment * 4
}
