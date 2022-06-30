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
