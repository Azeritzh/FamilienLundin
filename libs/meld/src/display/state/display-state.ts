import { BlockChunk, ControllerType, ScreenSize } from "@lundin/age"
import { Rotate, Vector2, Vector3 } from "@lundin/utility"
import { DisplayConfig } from "./display-config"
import { DisplayEntity } from "../display-entity-drawer"
import { DisplayArea } from "../services/camera"

export class DisplayState {
	constructor(
		public Size: ScreenSize,
		public PlayerName = "",

		// Camera
		public CameraFocus = new Vector3(0, 0, 0),
		public CameraPosition = new Vector3(0, 0, 0),
		public ViewDirection: ViewDirection = <ViewDirection>6,
		public LookingMode: LookingMode = <LookingMode>0,

		// Display details
		public FractionOfTick = 0,
		public PointerTarget: Vector3 = Vector3.Zero,
		public PointerPosition: Vector2 = Vector2.Zero,
		public PlayerIsBlocked = false,

		// Input details
		public CurrentControllerType: ControllerType = ControllerType.Controller,
		public InputMode: InputMode = <InputMode>0,
		public ChatCurrentText = "",
		public ChatLines: string[] = [],

		// Other stuff
		public DisplayEntities: DisplayEntity[] = [],
		public ShownLayers: { layer: number, area: DisplayArea }[] = [],
		public VisibleBlocks: BlockChunk<boolean> = new BlockChunk([false]),
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

export enum InputMode { Normal, Selection, Camera, Chat }
export enum LookingMode { Normal, Up, Down }
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