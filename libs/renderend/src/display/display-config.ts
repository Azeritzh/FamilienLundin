import { Input } from "./input-parser"

export interface DisplayConfig {
	renderToVirtualSize: boolean
	virtualPixelsPerTile: number
	virtualHeight: number
	font: string
	assetFolder: string
	inputs: Map<Input, string[]>,
	sprites: {
		[index: string]: {
			url: string
			width?: number
			height?: number
			centerX?: number
			centerY?: number
			framesX?: number
			framesY?: number
			frameInterval?: number
		}
	}
}
