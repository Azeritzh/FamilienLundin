import { TypeId } from "@lundin/age"
import { GameConfig } from "../config/game-config"
import { BlockSprites, BlockTileOverlays, BlockWallOverlays } from "../display/state/block-sprites"
import { DisplayConfig, GameplaySprites, SpriteInfo } from "../display/state/display-config"
import { EntitySprites, RotationSprite } from "../display/state/entity-sprites"
import { ItemAnimations } from "../display/state/item-animations"
import { updatesPerSecond } from "../meld-game"
import { SolidId } from "../state/block"
import { ItemTypeId } from "../state/item"

export function readDisplayConfig(gameConfig: GameConfig, deserialised: SerialisableDisplayConfig): DisplayConfig {

	const blockSprites = new Map<SolidId, BlockSprites[]>()
	for (const key in deserialised.BlockSprites)
		blockSprites.set(
			gameConfig.SolidTypeMap.TypeIdFor(key),
			deserialised.BlockSprites[key].map(x => BlockSpritesFrom(x))
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
			entry.Rotations.map(x => Object.assign(new RotationSprite(), x)),
			entry.HammerStrike?.map(x => Object.assign(new RotationSprite(), x)),
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
	const sprites = {}
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
		ItemAnimations: ItemAnimations.From(deserialised.ItemAnimations ?? {}),
		GameplaySprites: Object.assign(new GameplaySprites(), deserialised.GameplaySprites ?? {}),
		Sprites: sprites,
	}
}

function spriteInfoFrom(
	name: string,
	serialised: SerialisedSpriteInfo,
	defaultSpriteTypes: { [index: string]: SerialisedSpriteInfo },
): SpriteInfo {
	const defaults = defaultSpriteTypes[serialised.type]
	const frameInterval = serialised.frameInterval ?? defaults?.frameInterval ?? 0
	return {
		path: serialised.path ?? name,
		width: serialised.width ?? defaults?.width ?? 16,
		height: serialised.height ?? defaults?.height ?? 16,
		centerX: serialised.centerX ?? defaults?.centerX ?? 0,
		centerY: serialised.centerY ?? defaults?.centerY ?? 0,
		framesX: serialised.framesX ?? defaults?.framesX ?? 1,
		framesY: serialised.framesY ?? defaults?.framesY ?? 1,
		frameInterval: Math.floor(frameInterval * updatesPerSecond),
	}
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
	ItemAnimations?: ItemAnimations,
	GameplaySprites?: GameplaySprites,
	Sprites: { [index: string]: SerialisedSpriteInfo },

	DefaultSpriteTypes?: { [index: string]: SerialisedSpriteInfo },
}

interface SerialisedSpriteInfo {
	path?: string
	width?: number
	height?: number
	centerX?: number
	centerY?: number
	framesX?: number
	framesY?: number
	frameInterval?: number
	type?: string
}

interface SerialisableBlockSprites {
	StraightTile?: string,
	StraightFullWall?: string,
	StraightHalfWall?: string,
	DiagonalTile?: string,
	DiagonalFullWall?: string,
	DiagonalHalfWall?: string,

	TileNorth?: string,
	TileNorthEast?: string,
	TileEast?: string,
	TileSouthEast?: string,
	TileSouth?: string,
	TileSouthWest?: string,
	TileWest?: string,
	TileNorthWest?: string,

	FullWallNorth?: string,
	FullWallNorthEast?: string,
	FullWallEast?: string,
	FullWallSouthEast?: string,
	FullWallSouth?: string,
	FullWallSouthWest?: string,
	FullWallWest?: string,
	FullWallNorthWest?: string,

	HalfWallNorth?: string,
	HalfWallNorthEast?: string,
	HalfWallEast?: string,
	HalfWallSouthEast?: string,
	HalfWallSouth?: string,
	HalfWallSouthWest?: string,
	HalfWallWest?: string,
	HalfWallNorthWest?: string,
}

function BlockSpritesFrom(sprites: SerialisableBlockSprites) {
	return new BlockSprites(
		sprites.TileNorth ?? sprites.StraightTile ?? "missing-sprite",
		sprites.TileNorthEast ?? sprites.DiagonalTile ?? "missing-sprite",
		sprites.TileEast ?? sprites.StraightTile ?? "missing-sprite",
		sprites.TileSouthEast ?? sprites.DiagonalTile ?? "missing-sprite",
		sprites.TileSouth ?? sprites.StraightTile ?? "missing-sprite",
		sprites.TileSouthWest ?? sprites.DiagonalTile ?? "missing-sprite",
		sprites.TileWest ?? sprites.StraightTile ?? "missing-sprite",
		sprites.TileNorthWest ?? sprites.DiagonalTile ?? "missing-sprite",

		sprites.FullWallNorth ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.FullWallNorthEast ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.FullWallEast ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.FullWallSouthEast ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.FullWallSouth ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.FullWallSouthWest ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.FullWallWest ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.FullWallNorthWest ?? sprites.DiagonalFullWall ?? "missing-sprite",

		sprites.HalfWallNorth ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.HalfWallNorthEast ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.HalfWallEast ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.HalfWallSouthEast ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.HalfWallSouth ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.HalfWallSouthWest ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
		sprites.HalfWallWest ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
		sprites.HalfWallNorthWest ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite"
	)
}
