export interface BaseDisplayConfig {
	RenderToVirtualSize: boolean
	VirtualPixelsPerTile: number
	VirtualHeight: number
	AssetFolder: string
	Sprites: {
		[index: string]: {
			path: string
			width?: number
			height?: number
			centerX?: number
			centerY?: number
			offsetX?: number
			offsetY?: number
		}
	},
}
