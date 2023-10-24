import { DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { BlockType } from "../../state/block"
import { DisplayConfig } from "../state/display-config"
import { AngleFromNorth, DisplayState, ViewDirection } from "../state/display-state"
import { Visibility } from "./visibility"

export class Camera {
	constructor(
		private Game: Meld,
		private DisplayProvider: DisplayProvider,
		private Config: DisplayConfig,
		private State: DisplayState,
	) {
		Camera.FloorHeight.z = 1 / (Config.WallDisplayHeight * Config.VirtualPixelsPerTile)
	}

	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static NoHeight = new Vector3(0, 0, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 40) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1 - 0.00001)

	public static North = new Vector3(0, -1, 0)
	public static NorthEast = new Vector3(1, -1, 0)
	public static East = new Vector3(1, 0, 0)
	public static SouthEast = new Vector3(1, 1, 0)
	public static South = new Vector3(0, 1, 0)
	public static SouthWest = new Vector3(-1, 1, 0)
	public static West = new Vector3(-1, 0, 0)
	public static NorthWest = new Vector3(-1, -1, 0)
	public static Above = new Vector3(0, 0, 1)
	public static Below = new Vector3(0, 0, -1)

	public TopTile = new Vector3(0, -1, 0) //apparent north tile
	public TopRightTile = new Vector3(1, -1, 0) //apparent north-east tile
	public RightTile = new Vector3(1, 0, 0) //apparent east tile
	public BottomRightTile = new Vector3(1, 1, 0) //apparent south-east tile
	public BottomTile = new Vector3(0, 1, 0) //apparent south tile
	public BottomLeftTile = new Vector3(-1, 1, 0) //apparent south-west tile
	public LeftTile = new Vector3(-1, 0, 0) //apparent west tile
	public TopLeftTile = new Vector3(-1, -1, 0) //apparent north-west tile

	private Adjustable = new Vector3(0, 0, 0)

	public FocusOn(entity: Id) {
		this.SetCurrentPositionWith(
			this.State.FocusPoint,
			this.Game.Entities.Position.Get.Of(entity) ?? Vector3.Zero,
			this.Game.Entities.Velocity.Get.Of(entity),
		)
	}

	private _adjustableCurrentPosition = new Vector3(0, 0, 0)
	private SetCurrentPositionWith(destination: Vector3, position: Vector3, velocity: Vector3 = null) {
		return velocity
			? destination.setFrom(position).addFrom(this._adjustableCurrentPosition.setFrom(velocity).multiplyFrom(this.State.FractionOfTick))
			: destination.setFrom(position)
	}

	DrawAnimated(
		sprite: string,
		layer: number,
		position: Vector3,
		velocity: Vector3 = null,
		animationStart = 0,
		rotation = 0,
		color: Vector3 = null,
		alpha = 1,
		allowTransparentInFrontOfPlayer = false,
		pixelOffsetX = 0,
		pixelOffsetY = 0
	) {
		const config = this.Config.Sprites[sprite]
		const frame = this.AnimationFrame(config.frameInterval, config.framesX, config.framesY, animationStart)
		this.Draw(sprite, layer, position, velocity, frame, rotation, color, alpha, allowTransparentInFrontOfPlayer, pixelOffsetX, pixelOffsetY)
	}

	private AnimationFrame(frameInterval: number, framesX: number, framesY: number, animationStart: number) {
		if (!frameInterval)
			return 0
		const numberOfFrames = framesX * framesY
		const tick = this.Game.State.Globals.Tick - animationStart
		const frameIndex = Math.floor(tick / frameInterval) % numberOfFrames
		return frameIndex
	}

	Draw(
		sprite: string,
		layer: number,
		position: Vector3,
		velocity: Vector3 = null,
		frameIndex = 0,
		rotation = 0,
		color: Vector3 = null,
		alpha = 1,
		allowTransparentInFrontOfPlayer = false,
		pixelOffsetX = 0,
		pixelOffsetY = 0
	) {
		const currentPosition = this.SetCurrentPositionWith(this.Adjustable, position, velocity)
		this.AdjustForFocusAndCamera(currentPosition)
		const screenX = this.ScreenXFor(currentPosition) + pixelOffsetX / this.Config.VirtualPixelsPerTile
		const screenY = this.ScreenYFor(currentPosition) + pixelOffsetY / this.Config.VirtualPixelsPerTile
		if (allowTransparentInFrontOfPlayer && this.State.PlayerIsBlocked && this.IsInFrontOfPlayer(position, screenX, screenY))
			alpha = this.Config.BlockingTransparencyAlpha
		if (currentPosition.z < 0)
			color = this.DarkenByDepth(color ?? new Vector3(1, 1, 1), currentPosition.z)
		currentPosition.z = position.z
		const config = this.Config.Sprites[sprite]
		const frameX = frameIndex % config.framesX
		const frameY = Math.floor(frameIndex / config.framesX) % config.framesY
		this.DisplayProvider.Draw(
			sprite,
			screenX, screenY,
			frameX, frameY,
			this.sortingNumberFor(currentPosition, layer),
			rotation,
			color,
			alpha,
		)
	}


	private _adjustableIsInFrontOfPlayer = new Vector3(0, 0, 0)
	private IsInFrontOfPlayer(position: Vector3, screenX: number, screenY: number) {
		const layerDifference = Math.floor(position.z) - Math.floor(this.State.FocusPoint.z)
		if (layerDifference <= 0)
			return false
		const vectorFromMidScreen = this._adjustableIsInFrontOfPlayer.set(screenX - this.State.Size.WidthInTiles / 2, screenY - this.State.Size.HeightInTiles / 2, 0)
		return vectorFromMidScreen.lengthSquared() < this.Config.BlockingTransparencyRadius * this.Config.BlockingTransparencyRadius
	}

	private DarkenByDepth(color: Vector3, depth: number) {
		if (depth < 0)
			return color.multiplyFrom(1 + depth / 10)
		return color
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
			position.x + this.State.Size.WidthInTiles / 2,
			position.y + this.State.Size.HeightInTiles / 2 - this.Config.WallDisplayHeight * position.z)
	}

	private ScreenXFor(position: Vector3) {
		return position.x + this.State.Size.WidthInTiles / 2
	}

	private ScreenYFor(position: Vector3) {
		return position.y + this.State.Size.HeightInTiles / 2 - this.Config.WallDisplayHeight * position.z
	}

	private sortingNumberFor(position: Vector3, layer: number) {
		const z = Math.floor(position.z) + layer
		const rangeZ = ((this.Config.DisplayDepth + 2) * 2 + 1) // adding 2: 1 due to Layer.Top, and 1 due to z position within each layer
		const minZ = this.State.FocusPoint.z - rangeZ / 2
		const normalisedZ = (z - minZ) / rangeZ

		const rangeY = this.State.Size.HeightInTiles + (this.Config.DisplayDepth * 2 + 1) * this.Config.WallDisplayHeight
		const minY = - rangeY / 2
		const normalisedY = (position.y - minY) / rangeY
		const ySortingComponent = (normalisedY / Layer.NumberOfLayers) / rangeZ

		return normalisedZ + ySortingComponent
	}

	public TilePositionFor(x: number, y: number) {
		let apparentRelativePositionToFocus = new Vector3(
			x * this.State.Size.WidthInTiles - this.State.Size.WidthInTiles / 2,
			y * this.State.Size.HeightInTiles - this.State.Size.HeightInTiles / 2,
			0)
		if (this.IsDiagonalView())
			apparentRelativePositionToFocus = apparentRelativePositionToFocus.multiply(0.5) // Why half? Hell if I know...
		return this.RevertFocusAndCameraAdjustment(apparentRelativePositionToFocus)
	}

	public RotateCamera(steps: number) {
		this.State.ViewDirection += steps
		if (this.State.ViewDirection > ViewDirection.NorthEast)
			this.State.ViewDirection = ViewDirection.East
		if (this.State.ViewDirection < ViewDirection.East)
			this.State.ViewDirection = ViewDirection.NorthEast
		this.UpdateDirections()
	}

	private UpdateDirections() {
		this.RotateAndRound(this.TopTile, Camera.North)
		this.RotateAndRound(this.TopRightTile, Camera.NorthEast)
		this.RotateAndRound(this.RightTile, Camera.East)
		this.RotateAndRound(this.BottomRightTile, Camera.SouthEast)
		this.RotateAndRound(this.BottomTile, Camera.South)
		this.RotateAndRound(this.BottomLeftTile, Camera.SouthWest)
		this.RotateAndRound(this.LeftTile, Camera.West)
		this.RotateAndRound(this.TopLeftTile, Camera.NorthWest)
	}

	private RotateAndRound(rotated: Vector3, vector: Vector3) {
		rotated.setFrom(vector).rotateFrom(AngleFromNorth(this.State.ViewDirection))
		rotated.x = Math.round(rotated.x)
		rotated.y = Math.round(rotated.y)
		rotated.z = Math.round(rotated.z)
		return rotated
	}

	public IsDiagonalView() {
		return this.State.ViewDirection % 2 == 1
	}

	private _adjustableIsWithinScreen = new Vector3(0, 0, 0)
	public IsWithinScreen(position: Vector3) {
		const pos = this._adjustableIsWithinScreen.setFrom(position)
		this.AdjustForFocusAndCamera(pos)
		const screenX = this.ScreenXFor(pos)
		const screenY = this.ScreenYFor(pos)
		return 0 - Visibility.ScreenMargin < screenX && screenX < this.State.Size.WidthInTiles + Visibility.ScreenMargin
			&& 0 - Visibility.ScreenMargin < screenY && screenY < this.State.Size.HeightInTiles + Visibility.ScreenMargin
	}

	public static HeightOf(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Camera.FloorHeight
			case BlockType.Half: return Camera.HalfHeight
			case BlockType.Full: return Camera.FullHeight
			default: return Camera.NoHeight
		}
	}
}

export class DisplayArea {
	constructor(
		public Top: number,
		public Bottom: number,
		public Left: number,
		public Right: number,
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
