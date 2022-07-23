import { SolidId } from "../../state/block"
import { ViewDirection } from "./display-state"
import { Input } from "../services/input-parser"

export interface DisplayConfig {
	RenderToVirtualSize: boolean
	VirtualPixelsPerTile: number
	VirtualHeight: number
	WallDisplayHeight: number
	DisplayDepth: number
	TransparencyRadius: number
	BlockingTransparencyRadius: number
	AssetFolder: string

	Inputs: Map<Input, string[]>

	DefaultTileOverlays: BlockTileOverlays
	DefaultWallOverlays: BlockWallOverlays
	BlockSprites: Map<SolidId, BlockSprites[]>
	BlockTileOverlays: Map<SolidId, BlockTileOverlays>
	BlockWallOverlays: Map<SolidId, BlockWallOverlays>
	GameplaySprites: GameplaySprites
	Sprites: { [index: string]: SpriteInfo }
}

export class GameplaySprites {
	constructor(
		public ShadowSmall = "missing-sprite",
		public ShadowMedium = "missing-sprite",
		public ShadowBig = "missing-sprite",
		public WallShadowFullLeft = "missing-sprite",
		public WallShadowFullRight = "missing-sprite",
		public WallShadowFullDiagonal = "missing-sprite",
		public WallShadowHalfLeft = "missing-sprite",
		public WallShadowHalfRight = "missing-sprite",
		public WallShadowHalfDiagonal = "missing-sprite",
		public DashCloud = "missing-sprite",
		public DashRecharge = "missing-sprite",
		public DashTarget = "missing-sprite",
		public DashTargetFade = "missing-sprite",
		public DashFail = "missing-sprite",
		public DashMarker = "missing-sprite",
		public DashFailMarker = "missing-sprite",
		public HudLeft = "missing-sprite",
		public HudRight = "missing-sprite"
	) { }
}

export interface SpriteInfo {
	path: string
	width: number
	height: number
	centerX: number
	centerY: number
	framesX: number
	framesY: number
	frameInterval: number
}

export function DurationOf(info: SpriteInfo) {
	return info.framesX * info.framesY * info.frameInterval
}

export class BlockSprites {
	constructor(
		public TileNorth: string,
		public TileNorthEast: string,
		public TileEast: string,
		public TileSouthEast: string,
		public TileSouth: string,
		public TileSouthWest: string,
		public TileWest: string,
		public TileNorthWest: string,

		public FullWallNorth: string,
		public FullWallNorthEast: string,
		public FullWallEast: string,
		public FullWallSouthEast: string,
		public FullWallSouth: string,
		public FullWallSouthWest: string,
		public FullWallWest: string,
		public FullWallNorthWest: string,

		public HalfWallNorth: string,
		public HalfWallNorthEast: string,
		public HalfWallEast: string,
		public HalfWallSouthEast: string,
		public HalfWallSouth: string,
		public HalfWallSouthWest: string,
		public HalfWallWest: string,
		public HalfWallNorthWest: string,
	) { }

	public TileFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.TileNorth
			case ViewDirection.NorthEast: return this.TileNorthEast
			case ViewDirection.East: return this.TileEast
			case ViewDirection.SouthEast: return this.TileSouthEast
			case ViewDirection.South: return this.TileSouth
			case ViewDirection.SouthWest: return this.TileSouthWest
			case ViewDirection.West: return this.TileWest
			case ViewDirection.NorthWest: return this.TileNorthWest
		}
	}

	public FullWallFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.FullWallNorth
			case ViewDirection.NorthEast: return this.FullWallNorthEast
			case ViewDirection.East: return this.FullWallEast
			case ViewDirection.SouthEast: return this.FullWallSouthEast
			case ViewDirection.South: return this.FullWallSouth
			case ViewDirection.SouthWest: return this.FullWallSouthWest
			case ViewDirection.West: return this.FullWallWest
			case ViewDirection.NorthWest: return this.FullWallNorthWest
		}
	}

	public HalfWallFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.HalfWallNorth
			case ViewDirection.NorthEast: return this.HalfWallNorthEast
			case ViewDirection.East: return this.HalfWallEast
			case ViewDirection.SouthEast: return this.HalfWallSouthEast
			case ViewDirection.South: return this.HalfWallSouth
			case ViewDirection.SouthWest: return this.HalfWallSouthWest
			case ViewDirection.West: return this.HalfWallWest
			case ViewDirection.NorthWest: return this.HalfWallNorthWest
		}
	}
}

export class BlockTileOverlays {
	constructor(
		public tileOverlayTop = "default-tile-top",
		public tileOverlayBottom = "default-tile-bottom",
		public tileOverlayLeft = "default-tile-left",
		public tileOverlayRight = "default-tile-right",
		public tileOverlayTopLeft = "default-tile-top-left",
		public tileOverlayTopRight = "default-tile-top-right",
		public tileOverlayBottomLeft = "default-tile-bottom-left",
		public tileOverlayBottomRight = "default-tile-bottom-right"
	) { }
}

export class BlockWallOverlays {
	constructor(
		public straightHalfWallOverlayLeft = "default-straight-half-wall-left",
		public straightHalfWallOverlayRight = "default-straight-half-wall-right",
		public diagonalHalfWallOverlayLeft = "default-diagonal-half-wall-left",
		public diagonalHalfWallOverlayRight = "default-diagonal-half-wall-right",
		public straightFullWallOverlayLeft = "default-straight-full-wall-left",
		public straightFullWallOverlayRight = "default-straight-full-wall-right",
		public diagonalFullWallOverlayLeft = "default-diagonal-full-wall-left",
		public diagonalFullWallOverlayRight = "default-diagonal-full-wall-right"
	) { }
}
