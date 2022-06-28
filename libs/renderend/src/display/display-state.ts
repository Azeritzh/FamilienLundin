import { Vector2 } from "@lundin/utility"
import { DisplayConfig } from "./display-config"

export class DisplayState {
	constructor(
		public size: ScreenSize,
		public fractionOfTick = 0,
		public displayEntities: DisplayEntity[] = [],
	) { }

	public static from(config: DisplayConfig) {
		return new DisplayState(new ScreenSize(
			config.renderToVirtualSize,
			config.virtualPixelsPerTile,
			100,
			100,
			config.virtualHeight,
			config.virtualHeight))
	}
}

export interface DisplayEntity {
	sprite: string
	position: Vector2
	velocity: Vector2
	endTick: number
	animationStart: number
}

export class ScreenSize {
	constructor(
		public renderToVirtualSize: boolean,
		public virtualPixelsPerTile: number,
		public hostWidth: number,
		public hostHeight: number,
		public virtualWidth: number,
		public virtualHeight: number,
	) { }

	get hostPixelsPerTile() { return (this.hostHeight / this.virtualHeight) * this.virtualPixelsPerTile }
	get canvasWidth() { return this.renderToVirtualSize ? this.virtualWidth : this.hostWidth }
	get canvasHeight() { return this.renderToVirtualSize ? this.virtualHeight : this.hostHeight }
	get widthInTiles() { return this.virtualWidth / this.virtualPixelsPerTile }
	get heightInTiles() { return this.virtualHeight / this.virtualPixelsPerTile }

	updateHostSize(width: number, height: number) {
		this.hostWidth = width
		this.hostHeight = height
		this.virtualWidth = this.hostWidth * (this.virtualHeight / this.hostHeight)
	}
}