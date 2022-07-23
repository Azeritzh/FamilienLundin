import { GameConfig } from "../config/game-config"
import { BlockSprites, BlockTileOverlays, BlockWallOverlays, DisplayConfig, GameplaySprites, SpriteInfo } from "../display/state/display-config"
import { Input } from "../display/services/input-parser"
import { updatesPerSecond } from "../meld-game"
import { SolidId } from "../state/block"

export function readDisplayConfig(gameConfig: GameConfig, deserialised: SerialisableDisplayConfig): DisplayConfig {

	const blockSprites = new Map<SolidId, BlockSprites[]>()
	for (const key in deserialised.blockSprites)
		blockSprites.set(
			gameConfig.SolidTypeMap.TypeIdFor(key),
			deserialised.blockSprites[key].map(x => BlockSpritesFrom(x))
		)

	const blockTileOverlays = new Map<SolidId, BlockTileOverlays>()
	for (const key in deserialised.blockTileOverlays)
		blockTileOverlays.set(
			gameConfig.SolidTypeMap.TypeIdFor(key),
			Object.assign(new BlockTileOverlays(), deserialised.blockTileOverlays[key])
		)

	const blockWallOverlays = new Map<SolidId, BlockWallOverlays>()
	for (const key in deserialised.blockWallOverlays)
		blockWallOverlays.set(
			gameConfig.SolidTypeMap.TypeIdFor(key),
			Object.assign(new BlockWallOverlays(), deserialised.blockWallOverlays[key])
		)

	const inputs = new Map<Input, string[]>()
	for (const key in deserialised.inputs)
		inputs.set(Input[key], deserialised.inputs[key])

	const defaultSpriteTypes = deserialised.defaultSpriteTypes ?? {}
	const sprites = {}
	for (const key in deserialised.sprites)
		sprites[key] = spriteInfoFrom(key, deserialised.sprites[key], defaultSpriteTypes)

	return {
		RenderToVirtualSize: deserialised.renderToVirtualSize ?? true,
		VirtualPixelsPerTile: deserialised.virtualPixelsPerTile ?? 16,
		VirtualHeight: deserialised.virtualHeight ?? 360,
		WallDisplayHeight: deserialised.wallDisplayHeight ?? 2,
		DisplayDepth: deserialised.displayDepth ?? 4,
		AssetFolder: deserialised.assetFolder ?? "assets/",

		Inputs: inputs,
		DefaultTileOverlays: Object.assign(new BlockTileOverlays(), deserialised.defaultTileOverlays ?? {}),
		DefaultWallOverlays: Object.assign(new BlockWallOverlays(), deserialised.defaultTileOverlays ?? {}),
		BlockSprites: blockSprites,
		BlockTileOverlays: blockTileOverlays,
		BlockWallOverlays: blockWallOverlays,
		GameplaySprites: Object.assign(new GameplaySprites(), ToPascalCase(deserialised.gameplaySprites) ?? {}),
		Sprites: sprites,
	}
}

export function ToPascalCase(object: any): any {
	const newObject = {}
	for (const key in object)
		newObject[key[0].toUpperCase() + key.substring(1)] = object[key]
	return newObject
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
	renderToVirtualSize?: boolean
	virtualPixelsPerTile?: number
	virtualHeight?: number
	wallDisplayHeight?: number
	displayDepth?: number
	assetFolder?: string
	inputs: { [input: string]: string[] }

	defaultTileOverlays?: BlockTileOverlays,
	defaultWallOverlays?: BlockWallOverlays,
	blockSprites?: { [index: string]: SerialisableBlockSprites[] },
	blockTileOverlays?: { [index: string]: BlockTileOverlays },
	blockWallOverlays?: { [index: string]: BlockWallOverlays },
	gameplaySprites: { [index: string]: string },
	sprites: { [index: string]: SerialisedSpriteInfo },

	defaultSpriteTypes?: { [index: string]: SerialisedSpriteInfo },
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
	straightTile?: string,
	straightFullWall?: string,
	straightHalfWall?: string,
	diagonalTile?: string,
	diagonalFullWall?: string,
	diagonalHalfWall?: string,

	tileNorth?: string,
	tileNorthEast?: string,
	tileEast?: string,
	tileSouthEast?: string,
	tileSouth?: string,
	tileSouthWest?: string,
	tileWest?: string,
	tileNorthWest?: string,

	fullWallNorth?: string,
	fullWallNorthEast?: string,
	fullWallEast?: string,
	fullWallSouthEast?: string,
	fullWallSouth?: string,
	fullWallSouthWest?: string,
	fullWallWest?: string,
	fullWallNorthWest?: string,

	halfWallNorth?: string,
	halfWallNorthEast?: string,
	halfWallEast?: string,
	halfWallSouthEast?: string,
	halfWallSouth?: string,
	halfWallSouthWest?: string,
	halfWallWest?: string,
	halfWallNorthWest?: string,
}

function BlockSpritesFrom(sprites: SerialisableBlockSprites) {
	return new BlockSprites(
		sprites.tileNorth ?? sprites.straightTile ?? "missing-sprite",
		sprites.tileNorthEast ?? sprites.diagonalTile ?? "missing-sprite",
		sprites.tileEast ?? sprites.straightTile ?? "missing-sprite",
		sprites.tileSouthEast ?? sprites.diagonalTile ?? "missing-sprite",
		sprites.tileSouth ?? sprites.straightTile ?? "missing-sprite",
		sprites.tileSouthWest ?? sprites.diagonalTile ?? "missing-sprite",
		sprites.tileWest ?? sprites.straightTile ?? "missing-sprite",
		sprites.tileNorthWest ?? sprites.diagonalTile ?? "missing-sprite",

		sprites.fullWallNorth ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.fullWallNorthEast ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.fullWallEast ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.fullWallSouthEast ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.fullWallSouth ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.fullWallSouthWest ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.fullWallWest ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.fullWallNorthWest ?? sprites.diagonalFullWall ?? "missing-sprite",

		sprites.halfWallNorth ?? sprites.straightHalfWall ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.halfWallNorthEast ?? sprites.diagonalHalfWall ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.halfWallEast ?? sprites.straightHalfWall ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.halfWallSouthEast ?? sprites.diagonalHalfWall ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.halfWallSouth ?? sprites.straightHalfWall ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.halfWallSouthWest ?? sprites.diagonalHalfWall ?? sprites.diagonalFullWall ?? "missing-sprite",
		sprites.halfWallWest ?? sprites.straightHalfWall ?? sprites.straightFullWall ?? "missing-sprite",
		sprites.halfWallNorthWest ?? sprites.diagonalHalfWall ?? sprites.diagonalFullWall ?? "missing-sprite"
	)
}
