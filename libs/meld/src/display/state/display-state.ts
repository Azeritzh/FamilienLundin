import { ScreenSize } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { DisplayConfig } from "./display-config"
import { DisplayEntity } from "../display-entity-drawer"

export class DisplayState {
	constructor(
		public Size: ScreenSize,
		public PlayerName: string = "",
		public FractionOfTick = 0,
		public FocusPoint = new Vector3(0, 0, 0),
		public ViewDirection: ViewDirection = <ViewDirection>0,
		public DisplayEntities: DisplayEntity[] = [],
	) { }

	public static from(config: DisplayConfig, playerName: string) {
		return new DisplayState(
			new ScreenSize(
				config.RenderToVirtualSize,
				config.VirtualPixelsPerTile,
				100,
				100,
				config.VirtualHeight,
				config.VirtualHeight),
			playerName,
		)
	}
}

export enum ViewDirection { North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest }

export function AngleOf(direction: ViewDirection) {
	const oneEighthCircle = 0.25 * Math.PI
	return oneEighthCircle * direction
}
