import { ScreenSize } from "@lundin/age"
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
			config.RenderToVirtualSize,
			config.VirtualPixelsPerTile,
			100,
			100,
			config.VirtualHeight,
			config.VirtualHeight))
	}
}

export interface DisplayEntity {
	sprite: string
	position: Vector2
	velocity: Vector2
	endTick: number
	animationStart: number
}
