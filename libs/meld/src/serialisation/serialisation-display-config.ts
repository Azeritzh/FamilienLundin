import { DisplayConfig } from "../display/display-config"
import { Input } from "../display/input-parser"
import { updatesPerSecond } from "../meld-game"

export function readDisplayConfig(jsonConfig: any): DisplayConfig {
	const config: SerialisableDisplayConfig = { ...jsonConfig }
	const inputs = new Map<Input, string[]>()
	for (const key in jsonConfig.inputs)
		inputs.set(Input[key], jsonConfig.inputs[key])
	const sprites = {}
	for (const key in config.sprites)
		sprites[key] = spriteInfoFrom(config.sprites[key])
	return {
		renderToVirtualSize: true,
		virtualPixelsPerTile: 16,
		virtualHeight: 360,
		wallDisplayHeight: 2,
		displayDepth: 4,
		...config,
		inputs,
		sprites,
	}
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

export interface SerialisableDisplayConfig {
	renderToVirtualSize: boolean
	virtualPixelsPerTile: number
	virtualHeight: number
	wallDisplayHeight: number
	displayDepth: number
	assetFolder: string
	inputs: { [input: string]: string[] }
	sprites: {
		[index: string]: SerialisedSpriteInfo
	}
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
