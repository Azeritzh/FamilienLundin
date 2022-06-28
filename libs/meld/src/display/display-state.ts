import { ScreenSize } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { DisplayConfig } from "./display-config"

export class DisplayState {
	constructor(
		public size: ScreenSize,
		public fractionOfTick = 0,
		public focusPoint = new Vector3(0, 0, 0),
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
