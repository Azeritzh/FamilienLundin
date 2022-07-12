import { Input } from "./input-parser"

export interface DisplayConfig {
	RenderToVirtualSize: boolean
	VirtualPixelsPerTile: number
	VirtualHeight: number
	WallDisplayHeight: number
	DisplayDepth: number,
	AssetFolder: string
	Inputs: Map<Input, string[]>,
	Sprites: {
		[index: string]: SpriteInfo
	},
}

export interface SpriteInfo {
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
