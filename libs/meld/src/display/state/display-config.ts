import { TypeId } from "@lundin/age"
import { ToClass } from "@lundin/utility"
import { SolidId } from "../../state/block"
import { ItemTypeId } from "../../state/item"
import { BlockSprites, BlockTileOverlays, BlockWallOverlays, SerialisableBlockSprites } from "./block-sprites"
import { EntitySprites, RotationSprite } from "./entity-sprites"
import { updatesPerSecond } from "../../meld-game"
import { GameConfig } from "../../config/game-config"

export class DisplayConfig {
	RenderToVirtualSize!: boolean
	VirtualPixelsPerTile!: number
	VirtualHeight!: number
	WallDisplayHeight!: number
	DisplayDepth!: number
	TransparencyRadius!: number
	TransparencyAlpha!: number
	BlockingTransparencyRadius!: number
	BlockingTransparencyAlpha!: number
	AssetFolder!: string

	DefaultTileOverlays!: BlockTileOverlays
	DefaultWallOverlays!: BlockWallOverlays
	BlockSprites!: Map<SolidId, BlockSprites[]>
	BlockTileOverlays!: Map<SolidId, BlockTileOverlays>
	BlockWallOverlays!: Map<SolidId, BlockWallOverlays>
	EntitySprites!: Map<TypeId, EntitySprites>
	ItemSprites!: Map<ItemTypeId, string>
	GameplaySprites!: GameplaySprites
	Sprites!: { [index: string]: SpriteInfo }

	public static From(gameConfig: GameConfig, deserialised: SerialisableDisplayConfig): DisplayConfig {

		const blockSprites = new Map<SolidId, BlockSprites[]>()
		for (const key in deserialised.BlockSprites)
			blockSprites.set(
				gameConfig.SolidTypeMap.TypeIdFor(key),
				deserialised.BlockSprites[key].map(x => BlockSprites.From(x, gameConfig.SolidTypeMap))
			)

		const blockTileOverlays = new Map<SolidId, BlockTileOverlays>()
		for (const key in deserialised.BlockTileOverlays)
			blockTileOverlays.set(
				gameConfig.SolidTypeMap.TypeIdFor(key),
				Object.assign(new BlockTileOverlays(), deserialised.BlockTileOverlays[key])
			)

		const blockWallOverlays = new Map<SolidId, BlockWallOverlays>()
		for (const key in deserialised.BlockWallOverlays)
			blockWallOverlays.set(
				gameConfig.SolidTypeMap.TypeIdFor(key),
				Object.assign(new BlockWallOverlays(), deserialised.BlockWallOverlays[key])
			)

		const entitySprites = new Map<TypeId, EntitySprites>()
		for (const key in deserialised.EntitySprites) {
			const entry = deserialised.EntitySprites[key]
			const sprites = new EntitySprites(
				entry.Idle.map(x => Object.assign(new RotationSprite(), x)),
				entry.Walk?.map(x => Object.assign(new RotationSprite(), x)),
				entry.Run?.map(x => Object.assign(new RotationSprite(), x)),
				entry.Dash?.map(x => Object.assign(new RotationSprite(), x)),
			)
			entitySprites.set(gameConfig.EntityTypeMap.TypeIdFor(key), sprites)
		}

		const itemSprites = new Map<ItemTypeId, string>()
		for (const key in deserialised.ItemSprites)
			itemSprites.set(
				gameConfig.ItemTypeMap.TypeIdFor(key),
				deserialised.ItemSprites[key]
			)

		const defaultSpriteTypes = deserialised.DefaultSpriteTypes ?? {}
		const sprites: { [index: string]: SpriteInfo } = {}
		for (const key in deserialised.Sprites)
			sprites[key] = spriteInfoFrom(key, deserialised.Sprites[key], defaultSpriteTypes)

		return {
			RenderToVirtualSize: deserialised.RenderToVirtualSize ?? true,
			VirtualPixelsPerTile: deserialised.VirtualPixelsPerTile ?? 16,
			VirtualHeight: deserialised.VirtualHeight ?? 360,
			WallDisplayHeight: deserialised.WallDisplayHeight ?? 2,
			DisplayDepth: deserialised.DisplayDepth ?? 4,
			TransparencyRadius: deserialised.TransparencyRadius ?? 5,
			TransparencyAlpha: deserialised.TransparencyAlpha ?? 0.4,
			BlockingTransparencyRadius: deserialised.BlockingTransparencyRadius ?? 10,
			BlockingTransparencyAlpha: deserialised.BlockingTransparencyAlpha ?? 0.2,
			AssetFolder: deserialised.AssetFolder ?? "assets/",

			DefaultTileOverlays: Object.assign(new BlockTileOverlays(), deserialised.DefaultTileOverlays ?? {}),
			DefaultWallOverlays: Object.assign(new BlockWallOverlays(), deserialised.DefaultWallOverlays ?? {}),
			BlockSprites: blockSprites,
			BlockTileOverlays: blockTileOverlays,
			BlockWallOverlays: blockWallOverlays,
			EntitySprites: entitySprites,
			ItemSprites: itemSprites,
			GameplaySprites: GameplaySprites.From(deserialised.GameplaySprites ?? {}),
			Sprites: sprites,
		}
	}
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
			(<any>model)[prop] = source[prop]
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

export interface SerialisableDisplayConfig {
	RenderToVirtualSize?: boolean
	VirtualPixelsPerTile?: number
	VirtualHeight?: number
	WallDisplayHeight?: number
	DisplayDepth?: number
	TransparencyRadius?: number
	TransparencyAlpha?: number
	BlockingTransparencyRadius?: number
	BlockingTransparencyAlpha?: number
	AssetFolder?: string

	DefaultTileOverlays?: BlockTileOverlays,
	DefaultWallOverlays?: BlockWallOverlays,
	BlockSprites?: { [index: string]: SerialisableBlockSprites[] },
	BlockTileOverlays?: { [index: string]: BlockTileOverlays },
	BlockWallOverlays?: { [index: string]: BlockWallOverlays },
	EntitySprites?: { [index: string]: EntitySprites },
	ItemSprites?: { [index: string]: string },
	GameplaySprites?: GameplaySprites,
	Sprites: { [index: string]: SerialisedSpriteInfo },

	DefaultSpriteTypes?: { [index: string]: SerialisedSpriteInfo },
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

export function spriteInfoFrom(
	name: string,
	serialised: SerialisedSpriteInfo,
	defaultSpriteTypes: { [index: string]: SerialisedSpriteInfo },
): SpriteInfo {
	const defaults = defaultSpriteTypes[serialised.type!]
	const frameInterval = serialised.frameInterval ?? defaults?.frameInterval ?? 0
	return {
		path: serialised.path ?? name,
		width: serialised.width ?? defaults?.width ?? 16,
		height: serialised.height ?? defaults?.height ?? 16,
		centerX: serialised.centerX ?? defaults?.centerX ?? 0,
		centerY: serialised.centerY ?? defaults?.centerY ?? 0,
		offsetX: serialised.offsetX ?? defaults?.offsetX ?? 0,
		offsetY: serialised.offsetY ?? defaults?.offsetY ?? 0,
		framesX: serialised.framesX ?? defaults?.framesX ?? 1,
		framesY: serialised.framesY ?? defaults?.framesY ?? 1,
		frameInterval: Math.floor(frameInterval * updatesPerSecond),
	}
}

interface SerialisedSpriteInfo {
	path?: string
	width?: number
	height?: number
	centerX?: number
	centerY?: number
	offsetX?: number
	offsetY?: number
	framesX?: number
	framesY?: number
	frameInterval?: number
	type?: string
}
