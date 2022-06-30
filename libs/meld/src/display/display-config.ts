import { updatesPerSecond } from "../meld-game"
import { Input } from "./input-parser"

export interface DisplayConfig {
	renderToVirtualSize: boolean
	virtualPixelsPerTile: number
	virtualHeight: number
	wallDisplayHeight: number
	assetFolder: string
	inputs: Map<Input, string[]>,
	sprites: {
		[index: string]: SpriteInfo
	},
}

export function readDisplayConfig(jsonConfig: any) {
	const config: DisplayConfig = { ...jsonConfig }
	config.inputs = new Map<Input, string[]>()
	for (const key in jsonConfig.inputs)
		config.inputs.set(Input[key], jsonConfig.inputs[key])
	for (const key in config.sprites)
		config.sprites[key] = spriteInfoFrom(config.sprites[key])
	return config
}

function spriteInfoFrom(serialised: SerialisedSpriteInfo) {
	const framesX = serialised.framesX ?? 1
	const framesY = serialised.framesY ?? 1
	const frameWeights = serialised.frameWeights ?? [1]
	while (frameWeights.length < framesX * framesY) {
		frameWeights.push(1)
	}
	return {
		path: serialised.path,
		width: serialised.width ?? 16,
		height: serialised.height ?? 16,
		centerX: serialised.centerX ?? 0,
		centerY: serialised.centerY ?? 0,
		framesX,
		framesY,
		frameInterval: Math.floor(serialised.frameInterval * updatesPerSecond) ?? 0,
		frameWeights,
	}
}

interface SpriteInfo {
	path: string
	width: number
	height: number
	centerX: number
	centerY: number
	framesX: number
	framesY: number
	frameInterval: number
	frameWeights: number[]
}

interface SerialisedSpriteInfo {
	path: string
	width?: number
	height?: number
	centerX?: number
	centerY?: number
	framesX?: number
	framesY?: number
	frameInterval?: number
	frameWeights?: number[]
}
