import { Input } from "./input-parser"

export interface DisplayConfig {
	renderToVirtualSize: boolean
	virtualPixelsPerTile: number
	virtualHeight: number
	assetFolder: string
	inputs: Map<Input, string[]>,
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
	return config
}
