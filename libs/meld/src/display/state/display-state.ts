import { BlockChunk, ScreenSize } from "@lundin/age"
import { Rotate, Vector3 } from "@lundin/utility"
import { DisplayConfig } from "./display-config"
import { DisplayEntity } from "../display-entity-drawer"
import { DisplayArea } from "../services/camera"

export class DisplayState {
	constructor(
		public Size: ScreenSize,
		public PlayerName: string = "",
		public FractionOfTick = 0,
		public FocusPoint = new Vector3(0, 0, 0),
		public ViewDirection: ViewDirection = <ViewDirection>6,
		public DisplayEntities: DisplayEntity[] = [],
		public ShownLayers: { layer: number, area: DisplayArea }[] = [],
		public VisibleBlocks: BlockChunk<boolean> = new BlockChunk([false]),
		public PlayerIsBlocked = false,
		public InputMode: InputMode = <InputMode>0,
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

export enum ViewDirection { North = 6, NorthEast = 7, East = 0, SouthEast = 1, South = 2, SouthWest = 3, West = 4, NorthWest = 5 }

const tau = Math.PI * 2

export function AngleFromNorth(direction: ViewDirection) {
	const oneEighthCircle = 0.125 * tau
	return Rotate(oneEighthCircle * direction, tau / 4)
}

export function ViewDirectionFromAngle(angle: number) {
	angle = Rotate(angle, tau * 0.0625) // -1/16 circle for centering
	return <ViewDirection>Math.floor(8 * angle / tau)
}

export enum InputMode { Normal, Selection, Camera }
