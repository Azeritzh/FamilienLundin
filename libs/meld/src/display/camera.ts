import { DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { DisplayConfig } from "./display-config"
import { AngleOf, DisplayState, ViewDirection } from "./display-state"

export class Camera {
	constructor(
		private Game: Meld,
		private DisplayProvider: DisplayProvider,
		private Config: DisplayConfig,
		private State: DisplayState,
		public ShownLayers: { layer: number, area: DisplayArea }[] = []
	) { }

	private BaseTopTile = new Vector3(0, -1, 0)
	private BaseTopRightTile = new Vector3(1, -1, 0)
	private BaseRightTile = new Vector3(1, 0, 0)
	private BaseBottomRightTile = new Vector3(1, 1, 0)
	private BaseBottomTile = new Vector3(0, 1, 0)
	private BaseBottomLeftTile = new Vector3(-1, 1, 0)
	private BaseLeftTile = new Vector3(-1, 0, 0)
	private BaseTopLeftTile = new Vector3(-1, -1, 0)

	public TopTile = new Vector3(0, -1, 0) //apparent north tile
	public TopRightTile = new Vector3(1, -1, 0) //apparent north-east tile
	public RightTile = new Vector3(1, 0, 0) //apparent east tile
	public BottomRightTile = new Vector3(1, 1, 0) //apparent south-east tile
	public BottomTile = new Vector3(0, 1, 0) //apparent south tile
	public BottomLeftTile = new Vector3(-1, 1, 0) //apparent south-west tile
	public LeftTile = new Vector3(-1, 0, 0) //apparent west tile
	public TopLeftTile = new Vector3(-1, -1, 0) //apparent north-west tile

	private Adjustable = new Vector3(0, 0, 0)
	private ScreenMargin = 3

	public FocusOn(entity: Id) {
		this.SetCurrentPositionWith(
			this.State.FocusPoint,
			this.Game.Entities.Position.Get.Of(entity) ?? new Vector3(0, 0, 0),
			this.Game.Entities.Velocity.Get.Of(entity),
		)
		this.UpdateShownLayers()
	}

	private UpdateShownLayers() {
		this.ShownLayers.clear()
		for (let layer = -this.Config.DisplayDepth; layer <= this.Config.DisplayDepth; layer++)
			this.ShownLayers.push({ layer: layer + Math.floor(this.State.FocusPoint.z), area: this.displayAreaFor(layer) })
	}

	private displayAreaFor(layer: number) {
		const corners = [
			this.TilePositionFor(0, 0),
			this.TilePositionFor(1, 0),
			this.TilePositionFor(0, 1),
			this.TilePositionFor(1, 1),
		]
		let top = Number.MAX_VALUE
		let bottom = Number.MIN_VALUE
		let left = Number.MAX_VALUE
		let right = Number.MIN_VALUE
		for (const corner of corners) {
			if (corner.y < top)
				top = corner.y
			if (corner.y > bottom)
				bottom = corner.y
			if (corner.x < left)
				left = corner.x
			if (corner.x > right)
				right = corner.x
		}
		const layerAdjustment = this.BottomTile.multiply(layer * this.Config.WallDisplayHeight)
		return new DisplayArea(
			top + layerAdjustment.y - this.ScreenMargin,
			bottom + layerAdjustment.y + this.ScreenMargin,
			left + layerAdjustment.x - this.ScreenMargin,
			right + layerAdjustment.x + this.ScreenMargin)
	}

	private _adjustableCurrentPosition = new Vector3(0, 0, 0)
	private SetCurrentPositionWith(destination: Vector3, position: Vector3, velocity: Vector3 = null) {
		return velocity
			? destination.setFrom(position).addFrom(this._adjustableCurrentPosition.setFrom(velocity).multiplyFrom(this.State.FractionOfTick))
			: destination.setFrom(position)
	}

	DrawAnimated(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, animationStart = 0) {
		const config = this.Config.Sprites[sprite]
		const frame = this.AnimationFrame(config.frameInterval, config.framesX, config.framesY, animationStart)
		this.Draw(sprite, layer, position, velocity, frame)
	}

	private AnimationFrame(frameInterval: number, framesX: number, framesY: number, animationStart: number) {
		if (!frameInterval)
			return 0
		const numberOfFrames = framesX * framesY
		const tick = this.Game.State.Globals.Tick - animationStart
		const frameIndex = Math.floor(tick / frameInterval) % numberOfFrames
		return frameIndex
	}

	Draw(sprite: string, layer: number, position: Vector3, velocity: Vector3 = null, frameIndex = 0) {
		const currentPosition = this.SetCurrentPositionWith(this.Adjustable, position, velocity)
		this.AdjustForFocusAndCamera(currentPosition)
		const screenX = this.ScreenXFor(currentPosition)
		const screenY = this.ScreenYFor(currentPosition)
		currentPosition.z = position.z
		const config = this.Config.Sprites[sprite]
		const frameX = frameIndex % config.framesX
		const frameY = Math.floor(frameIndex / config.framesX) % config.framesY
		this.DisplayProvider.draw(sprite, screenX, screenY, frameX, frameY, this.sortingNumberFor(currentPosition, layer))
	}

	/** adjusts position in-place and returns it */
	private AdjustForFocusAndCamera(position: Vector3) {
		const diagonalFactor = 0.75 //1/MathF.Sqrt(2);
		const pos = position.subtractFrom(this.State.FocusPoint)
		switch (this.State.ViewDirection) {
			case ViewDirection.NorthEast: return position.set((pos.x + pos.y) * diagonalFactor, (-pos.x + pos.y) * diagonalFactor, pos.z)
			case ViewDirection.East: return position.set(pos.y, -pos.x, pos.z)
			case ViewDirection.SouthEast: return position.set((-pos.x + pos.y) * diagonalFactor, (-pos.x - pos.y) * diagonalFactor, pos.z)
			case ViewDirection.South: return position.set(-pos.x, -pos.y, pos.z)
			case ViewDirection.SouthWest: return position.set((-pos.x - pos.y) * diagonalFactor, (pos.x - pos.y) * diagonalFactor, pos.z)
			case ViewDirection.West: return position.set(-pos.y, pos.x, pos.z)
			case ViewDirection.NorthWest: return position.set((pos.x - pos.y) * diagonalFactor, (pos.x + pos.y) * diagonalFactor, pos.z)
			default: return pos
		}
	}

	/** Reverts adjustment to position in-place and returns it */
	private RevertFocusAndCameraAdjustment(pos: Vector3) {
		const diagonalFactor = 1.33333 // inverted of above
		const unrotated = this.RevertBla(pos, diagonalFactor)
		return unrotated.addFrom(this.State.FocusPoint)
	}

	private RevertBla(pos: Vector3, diagonalFactor: number) {
		switch (this.State.ViewDirection) {
			case ViewDirection.NorthWest: return pos.set((pos.x + pos.y) * diagonalFactor, (-pos.x + pos.y) * diagonalFactor, pos.z)
			case ViewDirection.West: return pos.set(pos.y, -pos.x, pos.z)
			case ViewDirection.SouthWest: return pos.set((-pos.x + pos.y) * diagonalFactor, (-pos.x - pos.y) * diagonalFactor, pos.z)
			case ViewDirection.South: return pos.set(-pos.x, -pos.y, pos.z)
			case ViewDirection.SouthEast: return pos.set((-pos.x - pos.y) * diagonalFactor, (pos.x - pos.y) * diagonalFactor, pos.z)
			case ViewDirection.East: return pos.set(-pos.y, pos.x, pos.z)
			case ViewDirection.NorthEast: return pos.set((pos.x - pos.y) * diagonalFactor, (pos.x + pos.y) * diagonalFactor, pos.z)
			default: return pos
		}
	}

	private ScreenPositionFor(position: Vector3) {
		return new Vector2(
			position.x + this.State.Size.widthInTiles / 2,
			position.y + this.State.Size.heightInTiles / 2 - this.Config.WallDisplayHeight * position.z)
	}

	private ScreenXFor(position: Vector3) {
		return position.x + this.State.Size.widthInTiles / 2
	}

	private ScreenYFor(position: Vector3) {
		return position.y + this.State.Size.heightInTiles / 2 - this.Config.WallDisplayHeight * position.z
	}

	private sortingNumberFor(position: Vector3, layer: number) {
		const z = Math.floor(position.z) + layer
		const rangeZ = (this.Config.DisplayDepth * 2 + 3) // adding 3 rather than 1 just to be on the safe side
		const minZ = this.State.FocusPoint.z - rangeZ / 2
		const normalisedZ = (z - minZ) / rangeZ

		const rangeY = this.State.Size.heightInTiles + (this.Config.DisplayDepth * 2 + 1) * this.Config.WallDisplayHeight
		const minY = - rangeY / 2
		const normalisedY = (position.y - minY) / rangeY
		const ySortingComponent = (normalisedY / Layer.NumberOfLayers) / rangeZ

		return normalisedZ + ySortingComponent
	}

	public TilePositionFor(x: number, y: number) {
		let apparentRelativePositionToFocus = new Vector3(
			x * this.State.Size.widthInTiles - this.State.Size.widthInTiles / 2,
			y * this.State.Size.heightInTiles - this.State.Size.heightInTiles / 2,
			0)
		if (this.IsDiagonalView())
			apparentRelativePositionToFocus = apparentRelativePositionToFocus.multiply(0.5) // Why half? Hell if I know...
		return this.RevertFocusAndCameraAdjustment(apparentRelativePositionToFocus)
	}

	public RotateCamera(steps: number) {
		this.State.ViewDirection += steps
		if (this.State.ViewDirection > ViewDirection.NorthWest)
			this.State.ViewDirection = ViewDirection.North
		if (this.State.ViewDirection < ViewDirection.North)
			this.State.ViewDirection = ViewDirection.NorthWest
		this.UpdateDirections()
	}

	private UpdateDirections() {
		this.RotateAndRound(this.TopTile, this.BaseTopTile)
		this.RotateAndRound(this.TopRightTile, this.BaseTopRightTile)
		this.RotateAndRound(this.RightTile, this.BaseRightTile)
		this.RotateAndRound(this.BottomRightTile, this.BaseBottomRightTile)
		this.RotateAndRound(this.BottomTile, this.BaseBottomTile)
		this.RotateAndRound(this.BottomLeftTile, this.BaseBottomLeftTile)
		this.RotateAndRound(this.LeftTile, this.BaseLeftTile)
		this.RotateAndRound(this.TopLeftTile, this.BaseTopLeftTile)
	}

	private RotateAndRound(rotated: Vector3, vector: Vector3) {
		rotated.setFrom(vector).rotateFrom(AngleOf(this.State.ViewDirection))
		rotated.x = Math.round(rotated.x)
		rotated.y = Math.round(rotated.y)
		rotated.z = Math.round(rotated.z)
		return rotated
	}

	public IsDiagonalView() {
		return this.State.ViewDirection % 2 == 1
	}

	public IsWithinScreen(position: Vector3) {
		this.AdjustForFocusAndCamera(position)
		const screenX = this.ScreenXFor(position)
		const screenY = this.ScreenYFor(position)
		return 0 - this.ScreenMargin < screenX && screenX < this.State.Size.widthInTiles + this.ScreenMargin
			&& 0 - this.ScreenMargin < screenY && screenY < this.State.Size.heightInTiles + this.ScreenMargin
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
