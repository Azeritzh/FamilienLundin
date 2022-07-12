import { DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

export class Camera {
	constructor(
		private Game: Meld,
		private DisplayProvider: DisplayProvider,
		private Config: DisplayConfig,
		private State: DisplayState,
		public ShownLayers: { layer: number, area: DisplayArea }[] = []
	) { }

	get top() { return this.State.FocusPoint.y - this.State.Size.heightInTiles / 2 }
	get bottom() { return this.State.FocusPoint.y + this.State.Size.heightInTiles / 2 }
	get left() { return this.State.FocusPoint.x - this.State.Size.widthInTiles / 2 }
	get right() { return this.State.FocusPoint.x + this.State.Size.widthInTiles / 2 }

	get topPosition() { return new Vector3(0, -1, 0) }
	get bottomPosition() { return new Vector3(0, 1, 0) }
	get leftPosition() { return new Vector3(-1, 0, 0) }
	get rightPosition() { return new Vector3(1, 0, 0) }

	public FocusOn(entity: Id) {
		this.State.FocusPoint = this.currentPositionFrom(
			this.Game.entities.Position.get.of(entity) ?? new Vector3(0, 0, 0),
			this.Game.entities.Velocity.get.of(entity),
		)
		this.updateShownLayers()
	}

	private updateShownLayers() {
		this.ShownLayers.clear()
		for (let layer = -this.Config.DisplayDepth; layer <= this.Config.DisplayDepth; layer++)
			this.ShownLayers.push({ layer: layer + Math.floor(this.State.FocusPoint.z), area: this.displayAreaFor(layer) })
	}

	private displayAreaFor(layer: number) {
		return new DisplayArea(
			this.top + layer * this.Config.WallDisplayHeight,
			this.bottom + layer * this.Config.WallDisplayHeight,
			this.left,
			this.right,
		)
	}

	private currentPositionFrom(position: Vector3, velocity: Vector3 = null) {
		return velocity
			? position.add(velocity.multiply(this.State.FractionOfTick))
			: position
	}

	DrawAnimated(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, animationStart = 0) {
		const config = this.Config.Sprites[sprite]
		const frame = this.animationFrame(config.frameInterval, config.framesX, config.framesY, animationStart)
		this.Draw(sprite, layer, position, velocity, frame)
	}

	private animationFrame(frameInterval: number, framesX: number, framesY: number, animationStart: number) {
		if (!frameInterval)
			return 0
		const numberOfFrames = framesX * framesY
		const tick = this.Game.state.Globals.Tick - animationStart
		const frameIndex = Math.floor(tick / frameInterval) % numberOfFrames
		return frameIndex
	}

	DrawVaried(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, variation = 0) {
		const config = this.Config.Sprites[sprite]
		const sumOfWeights = config.frameWeights.sum()
		let frameIndex = 0
		let sum = 0
		for (const weight of config.frameWeights) {
			sum += weight
			if (sum > variation % sumOfWeights)
				break
			frameIndex++
		}
		this.Draw(sprite, layer, position, velocity, frameIndex)
	}

	Draw(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, frameIndex = 0) {
		const currentPosition = this.currentPositionFrom(position, velocity)
		const screenPosition = this.screenPositionFor(currentPosition)
		const config = this.Config.Sprites[sprite]
		const frameX = frameIndex % config.framesX
		const frameY = Math.floor(frameIndex / config.framesX) % config.framesY
		this.DisplayProvider.draw(sprite, screenPosition.x, screenPosition.y, frameX, frameY, this.sortingNumberFor(currentPosition, layer))
	}

	private screenPositionFor(position: Vector3) {
		return new Vector2(
			position.x - this.left,
			position.y - this.top - this.Config.WallDisplayHeight * (position.z - this.State.FocusPoint.z))
	}

	private sortingNumberFor(position: Vector3, layer: number) {
		const z = Math.floor(position.z) + layer
		const rangeZ = (this.Config.DisplayDepth * 2 + 3) // adding 3 rather than 1 just to be on the safe side
		const minZ = this.State.FocusPoint.z - rangeZ / 2
		const normalisedZ = (z - minZ) / rangeZ

		const rangeY = this.State.Size.heightInTiles + (this.Config.DisplayDepth * 2 + 1) * this.Config.WallDisplayHeight
		const minY = this.State.FocusPoint.y - rangeY / 2
		const normalisedY = (position.y - minY) / rangeY
		const ySortingComponent = (normalisedY / Layer.NumberOfLayers) / rangeZ

		return normalisedZ + ySortingComponent
	}

	public tilePositionFor(x: number, y: number) {
		return new Vector3(x * this.State.Size.widthInTiles, y * this.State.Size.heightInTiles, 0)
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
