import { TypeId } from "@lundin/age"
import { ToClass } from "@lundin/utility"
import { SolidId } from "../../state/block"
import { ItemTypeId } from "../../state/item"
import { BlockSprites, BlockTileOverlays, BlockWallOverlays } from "./block-sprites"
import { EntitySprites } from "./entity-sprites"

export interface DisplayConfig {
	RenderToVirtualSize: boolean
	VirtualPixelsPerTile: number
	VirtualHeight: number
	WallDisplayHeight: number
	DisplayDepth: number
	TransparencyRadius: number
	TransparencyAlpha: number
	BlockingTransparencyRadius: number
	BlockingTransparencyAlpha: number
	AssetFolder: string

	DefaultTileOverlays: BlockTileOverlays
	DefaultWallOverlays: BlockWallOverlays
	BlockSprites: Map<SolidId, BlockSprites[]>
	BlockTileOverlays: Map<SolidId, BlockTileOverlays>
	BlockWallOverlays: Map<SolidId, BlockWallOverlays>
	EntitySprites: Map<TypeId, EntitySprites>
	ItemSprites: Map<ItemTypeId, string>
	GameplaySprites: GameplaySprites
	Sprites: { [index: string]: SpriteInfo }
}

export class GameplaySprites {
	constructor(
		public BlockMarker = new BlockMarkerSprites(),
		public Dash = new DashSprites(),
		public Shadow = new ShadowSprites(),
		public StandardMarker = "missing-sprite",
		public HudLeft = "missing-sprite",
		public HudRight = "missing-sprite"
	) { }

	static From(source: any) {
		const model = new GameplaySprites()
		for (const prop in source)
			model[prop] = source[prop]
		model.BlockMarker = ToClass(model.BlockMarker, BlockMarkerSprites)
		model.Dash = ToClass(model.Dash, DashSprites)
		model.Shadow = ToClass(model.Shadow, ShadowSprites)
		return model
	}
}

export class BlockMarkerSprites {
	constructor(
		public Straight = "missing-sprite",
		public StraightNear = "missing-sprite",
		public StraightFar = "missing-sprite",
		public StraightTop = "missing-sprite",
		public Diagonal = "missing-sprite",
		public DiagonalNear = "missing-sprite",
		public DiagonalFar = "missing-sprite",
		public DiagonalTop = "missing-sprite",
	) { }
}

export class DashSprites {
	constructor(
		public Cloud = "missing-sprite",
		public Recharge = "missing-sprite",
		public Target = "missing-sprite",
		public TargetFade = "missing-sprite",
		public Fail = "missing-sprite",
		public Marker = "missing-sprite",
		public FailMarker = "missing-sprite",
	) { }
}

export class ShadowSprites {
	constructor(
		public Small = "missing-sprite",
		public Medium = "missing-sprite",
		public Big = "missing-sprite",
		public WallFullLeft = "missing-sprite",
		public WallFullRight = "missing-sprite",
		public WallFullDiagonal = "missing-sprite",
		public WallHalfLeft = "missing-sprite",
		public WallHalfRight = "missing-sprite",
		public WallHalfDiagonal = "missing-sprite",
	) { }
}

export interface SpriteInfo {
	path: string
	width: number
	height: number
	centerX: number
	centerY: number
	offsetX: number
	offsetY: number
	framesX: number
	framesY: number
	frameInterval: number
}

export function DurationOf(info: SpriteInfo) {
	return info.framesX * info.framesY * info.frameInterval
}
