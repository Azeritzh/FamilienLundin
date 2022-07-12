import { updatesPerSecond } from "../renderend-game"
import { Input } from "./input-parser"

export interface DisplayConfig {
	RenderToVirtualSize: boolean
	VirtualPixelsPerTile: number
	VirtualHeight: number
	Font: string
	AssetFolder: string
	Inputs: Map<Input, string[]>,
	DeathAnimations: { [type: string]: string },
	Sprites: {
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
	const config: DisplayConfig = <any>{}
	for (const key in jsonConfig)
		config[key[0].toUpperCase() + key.substring(1)] = jsonConfig[key]
	config.Inputs = new Map<Input, string[]>()
	for (const key in jsonConfig.inputs)
		config.Inputs.set(Input[key], jsonConfig.inputs[key])
	for (const key in config.Sprites)
		if (config.Sprites[key].frameInterval)
			config.Sprites[key].frameInterval = config.Sprites[key].frameInterval * updatesPerSecond
	return config
}
