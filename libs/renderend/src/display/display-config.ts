import { updatesPerSecond } from "../renderend-game"
import { Input } from "./input-parser"

export interface DisplayConfig {
	renderToVirtualSize: boolean
	virtualPixelsPerTile: number
	virtualHeight: number
	font: string
	assetFolder: string
	inputs: Map<Input, string[]>,
	deathAnimations: { [type: string]: string },
	sprites: {
		[index: string]: {
			path: string
			width?: number
			height?: number
			centerX?: number
			centerY?: number
			framesX?: number
			framesY?: number
			frameInterval?: number
		}
	},
}

export function readDisplayConfig(jsonConfig: any) {
	const config: DisplayConfig = { ...jsonConfig }
	config.inputs = new Map<Input, string[]>()
	for (const key in jsonConfig.inputs)
		config.inputs.set(Input[key], jsonConfig.inputs[key])
	for (const key in config.sprites)
		if(config.sprites[key].frameInterval)
			config.sprites[key].frameInterval = config.sprites[key].frameInterval * updatesPerSecond
	return config
}
