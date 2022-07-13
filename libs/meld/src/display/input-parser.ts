import { BaseInputParser, DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { GenerateAction, MovementAction, SelectNextItemAction, PlaceBlockAction } from "../state/game-update"
import { Camera } from "./camera"
import { AngleOf, DisplayState } from "./display-state"

export class InputParser extends BaseInputParser<Input> {
	PreviousMovement = new Vector2(0, 0)

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	ParseInputs() {
		this.UpdateCamera()
		this.updateActionStates()
		return [
			this.parseGenerate(),
			this.parseMovement(),
			this.parsePlaceBlock(),
			this.parseSelectNextItem(),
		].filter(x => x)
	}

	private UpdateCamera() {
		if (this.hasJustBeenPressed(Input.RotateCameraRight))
			this.Camera.RotateCamera(1)
		if (this.hasJustBeenPressed(Input.RotateCameraLeft))
			this.Camera.RotateCamera(-1)
	}

	private parseMovement() {
		const factor = this.boolStateFor(Input.HoldWalk) ? 0.5 : 1
		const up = this.floatStateFor(Input.MoveUp) ?? 0
		const down = this.floatStateFor(Input.MoveDown) ?? 0
		const left = this.floatStateFor(Input.MoveLeft) ?? 0
		const right = this.floatStateFor(Input.MoveRight) ?? 0

		const baseMovement = new Vector2(right - left, down - up).rotate(AngleOf(this.State.ViewDirection))
		const movement = baseMovement.lengthSquared() > 1
			? baseMovement.unitVector().multiply(factor)
			: baseMovement.multiply(factor)
		if (movement.x === this.PreviousMovement.x && movement.y === this.PreviousMovement.y)
			return null
		this.PreviousMovement = movement
		return new MovementAction(this.Game.State.Players.get(this.State.PlayerName), movement)
	}

	private parseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private parsePlaceBlock() {
		const position = this.Camera.TilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		if (this.hasJustBeenPressed(Input.UseItem))
			return new PlaceBlockAction(this.Game.State.Players.get(this.State.PlayerName), position)
	}

	private parseSelectNextItem() {
		if (this.hasJustBeenPressed(Input.SelectNextItem))
			return new SelectNextItemAction(this.Game.State.Players.get(this.State.PlayerName))
	}
}

export enum Input {
	Generate,
	ToggleInventory,
	ToggleMenu,
	ToggleChat,

	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,

	UseItem,
	ToolA,
	ToolB,
	Action,

	SelectTopItem,
	SelectBottomItem,
	SelectLeftItem,
	SelectRightItem,

	SelectTopItemSet,
	SelectBottomItemSet,
	SelectLeftItemSet,
	SelectRightItemSet,

	SelectTopTool,
	SelectBottomTool,
	SelectLeftTool,
	SelectRightTool,

	MoveCameraUp,
	MoveCameraDown,
	MoveCameraLeft,
	MoveCameraRight,

	LookUp,
	LookDown,
	RotateCameraLeft,
	RotateCameraRight,

	// Selection mode:
	ToggleSelection,
	HoldSelection,

	SelectionModeSelectTopItem,
	SelectionModeSelectBottomItem,
	SelectionModeSelectLeftItem,
	SelectionModeSelectRightItem,

	SelectionModeSelectTopTool,
	SelectionModeSelectBottomTool,
	SelectionModeSelectLeftTool,
	SelectionModeSelectRightTool,

	// Camera mode:
	ToggleCamera,
	HoldCamera,

	CameraModeMoveCameraUp,
	CameraModeMoveCameraDown,
	CameraModeMoveCameraLeft,
	CameraModeMoveCameraRight,

	CameraModeLookUp,
	CameraModeLookDown,
	CameraModeRotateCameraLeft,
	CameraModeRotateCameraRight,

	// Extra:
	SelectNextItem,
	SelectPreviousItem,
	HoldWalk,
	ToggleWalk,
}
