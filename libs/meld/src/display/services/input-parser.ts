import { BaseInputParser, DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { GenerateAction, MovementAction, SelectItemAction, PlaceBlockAction, ChargeDashAction, ReleaseDashAction } from "../../state/game-update"
import { Camera } from "./camera"
import { AngleOf, DisplayState } from "../state/display-state"
import { Visibility } from "./visibility"

export class InputParser extends BaseInputParser<Input> {
	PreviousMovement = new Vector2(0, 0)

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		private DisplayProvider: DisplayProvider,
		private Visibility: Visibility,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	ParseInputs() {
		this.UpdateCamera()
		this.updateActionStates()
		const player = this.Game.State.Players.get(this.State.PlayerName)
		return [
			this.ParseGenerate(),
			this.ParseDash(player),
			this.ParseMovement(player),
			this.ParsePlaceBlock(),
			this.ParseSelectItem(player),
		].filter(x => x)
	}

	private UpdateCamera() {
		if (this.hasJustBeenPressed(Input.RotateCameraRight)) {
			this.Camera.RotateCamera(1)
			this.Visibility.UpdateSize()
		}
		if (this.hasJustBeenPressed(Input.RotateCameraLeft)) {
			this.Camera.RotateCamera(-1)
			this.Visibility.UpdateSize()
		}
	}

	private ParseMovement(player: Id) {
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
		return new MovementAction(player, movement)
	}

	private ParseDash(player: Id) {
		//var angle = CurrentControllerType == ControllerType.KeyboardAndMouse
		//	? this.GetVectorToMouse(player).GetAngle()
		//	: this.Game.Entities.Orientation.Get.Of(player) ?? 0;

		const angle = this.GetVectorToMouse(player).getAngle()

		//if (HasJustBeenPressed(Input.Action))
		//	new ChargeDashAction(player, angle);
		if (this.hasJustBeenReleased(Input.Action))
			return new ReleaseDashAction(player, angle)
		if (this.boolStateFor(Input.Action))
			return new ChargeDashAction(player, angle)
		return null
	}

	private GetVectorToMouse(player: Id) {
		const pointerVector = this.Camera.TilePositionFor(
			this.DisplayProvider.getInputState("MouseX"),
			this.DisplayProvider.getInputState("MouseY")
		).subtract(this.Game.Entities.Position.Get.Of(player) ?? new Vector3(0, 0, 0))
		return new Vector2(pointerVector.x, pointerVector.y)
	}

	private ParseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private ParsePlaceBlock() {
		const position = this.Camera.TilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		if (this.hasJustBeenPressed(Input.UseItem))
			return new PlaceBlockAction(this.Game.State.Players.get(this.State.PlayerName), position)
	}

	private ParseSelectItem(player: Id) {
		const selectableItems = this.Game.Entities.SelectableItems.Get.Of(player)
		if (!selectableItems)
			return null
		if (this.hasJustBeenPressed(Input.SelectNextItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet + 1)
		if (this.hasJustBeenPressed(Input.SelectPreviousItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet - 1)
		if (this.hasJustBeenPressed(Input.SelectTopItem))
			return new SelectItemAction(player, 0)
		if (this.hasJustBeenPressed(Input.SelectRightItem))
			return new SelectItemAction(player, 1)
		if (this.hasJustBeenPressed(Input.SelectBottomItem))
			return new SelectItemAction(player, 2)
		if (this.hasJustBeenPressed(Input.SelectLeftItem))
			return new SelectItemAction(player, 3)
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
