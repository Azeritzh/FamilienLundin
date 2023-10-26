import { TypeId } from "@lundin/age"
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
