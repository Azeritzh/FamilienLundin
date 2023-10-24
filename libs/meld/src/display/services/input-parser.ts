import { BaseInputParser, ControllerType, DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { ActionState, ChargeDashAction, JumpAction, MovementAction, ReleaseDashAction, SelectItemAction, SelectItemSetAction, SelectToolAction, UseItemAction, UseToolAction } from "../../state/game-update"
import { AngleFromNorth, DisplayState, InputMode, ViewDirection, ViewDirectionFromAngle } from "../state/display-state"
import { Camera } from "./camera"
import { Input } from "./input"
import { Visibility } from "./visibility"
import { BlockType, Blocks } from "../../state/block"

export class InputParser extends BaseInputParser<Input> {
	private CurrentTarget = Vector3.Zero
	private PreviousTarget = Vector3.Zero
	private CurrentVector = Vector2.Zero
	private PreviousVector = Vector2.Zero
	private Player: Id

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		private Visibility: Visibility,
		DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	GetNewActions() {
		const player = this.Game.State.Players.get(this.State.PlayerName)
		if (!player)
			return []
		this.Player = player

		this.UpdateMode()
		this.UpdatePointer()
		this.UpdateCamera()
		this.UpdateActionStates()

		return this.ParseActions()
	}

	private UpdateMode() {
		if (this.BoolStateFor(Input.HoldCamera))
			this.State.InputMode = InputMode.Camera
		else if (this.BoolStateFor(Input.HoldSelection))
			this.State.InputMode = InputMode.Selection
		else
			this.State.InputMode = InputMode.Normal
	}

	private UpdatePointer() {
		this.PreviousTarget = this.CurrentTarget
		this.CurrentTarget = this.CurrentControllerType == ControllerType.KeyboardAndMouse
			? this.GetMouseTarget()
			: this.GetRightStickTarget()
		this.PreviousVector = this.CurrentVector
		this.CurrentVector = this.CurrentControllerType == ControllerType.KeyboardAndMouse
			? this.GetVectorToMouse()
			: this.GetVectorToRightStick()
	}

	private ParseActions() {
		return [
			this.ParseAction(),
			this.ParseMovement(),
			this.ParseUseItem(),
			this.ParseUseTool(),
			this.ParseSelectItem(),
			this.ParseSelectTool(),
		].filter(x => x)
	}

	private GetMouseTarget() {
		return this.Camera.TilePositionFor(
			this.DisplayProvider.GetInputState("MouseX"),
			this.DisplayProvider.GetInputState("MouseY")
		)
	}

	private GetRightStickTarget() {
		return new Vector3(
			this.DisplayProvider.GetInputState("PadRightStickRight") - this.DisplayProvider.GetInputState("PadRightStickLeft"),
			this.DisplayProvider.GetInputState("PadRightStickDown") - this.DisplayProvider.GetInputState("PadRightStickUp"),
			0
		).addFrom((this.Game.Entities.Position.Get.Of(this.Player) ?? Vector3.Zero))
	}

	private GetVectorToMouse() {
		const pointerVector = this.Camera.TilePositionFor(
			this.DisplayProvider.GetInputState("MouseX"),
			this.DisplayProvider.GetInputState("MouseY")
		).subtract(this.Game.Entities.Position.Get.Of(this.Player) ?? Vector3.Zero)
		return new Vector2(pointerVector.x, pointerVector.y)
	}

	private GetVectorToRightStick() {
		return new Vector2(
			this.DisplayProvider.GetInputState("PadRightStickRight") - this.DisplayProvider.GetInputState("PadRightStickLeft"),
			this.DisplayProvider.GetInputState("PadRightStickDown") - this.DisplayProvider.GetInputState("PadRightStickUp")
		)
	}

	//////////////////////////////// CAMERA ////////////////////////////////

	private UpdateCamera() {
		if (this.HasJustBeenPressed(this.RotateRightInput())) {
			this.Camera.RotateCamera(1)
			this.Visibility.UpdateSize()
		}
		if (this.HasJustBeenPressed(this.RotateLeftInput())) {
			this.Camera.RotateCamera(-1)
			this.Visibility.UpdateSize()
		}
	}

	private RotateRightInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeRotateCameraRight
			: Input.RotateCameraRight
	}

	private RotateLeftInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeRotateCameraLeft
			: Input.RotateCameraLeft
	}

	//////////////////////////////// NORMAL ////////////////////////////////
	private PreviousMovement = Vector2.Zero

	private ParseMovement() {
		const factor = this.BoolStateFor(Input.HoldWalk) ? 0.5 : 1
		const up = this.FloatStateFor(this.MoveUpInput()) ?? 0
		const down = this.FloatStateFor(this.MoveDownInput()) ?? 0
		const left = this.FloatStateFor(this.MoveLeftInput()) ?? 0
		const right = this.FloatStateFor(this.MoveRightInput()) ?? 0

		const baseMovement = new Vector2(right - left, down - up).rotate(AngleFromNorth(this.State.ViewDirection))
		const movement = baseMovement.lengthSquared() > 1
			? baseMovement.unitVector().multiply(factor)
			: baseMovement.multiply(factor)
		if (movement.x === this.PreviousMovement.x && movement.y === this.PreviousMovement.y)
			return null
		this.PreviousMovement = movement
		return new MovementAction(this.Player, movement)
	}

	private ParseAction() {
		const angle = !this.CurrentVector.isZero()
			? this.CurrentVector.getAngle()
			: this.Game.Entities.Orientation.Get.Of(this.Player) ?? 0

		const nearestBlock = this.NearestBlockAt(angle)
		if (Blocks.TypeOf(nearestBlock) == BlockType.Full)
			return this.ParseJump()
		else
			return this.ParseDash(angle)
	}

	private ParseJump() {
		if (this.HasJustBeenReleased(this.ActionInput()))
			return new JumpAction(this.Player)
		return null
	}

	private ParseDash(angle: number) {
		//if (HasJustBeenPressed(Input.Action))
		//	new ChargeDashAction(player, angle);
		if (this.HasJustBeenReleased(this.ActionInput()))
			return new ReleaseDashAction(this.Player, angle)
		if (this.BoolStateFor(this.ActionInput()))
			return new ChargeDashAction(this.Player, angle)
		return null
	}

	private NearestBlockAt(angle: number) {
		const position = this.Game.Entities.Position.Get.Of(this.Player) ?? Vector3.Zero
		switch (ViewDirectionFromAngle(angle)) {
			case ViewDirection.North: return this.Game.Terrain.Get(position.X + Camera.North.X, position.Y + Camera.North.Y, position.Z + Camera.North.Z)
			case ViewDirection.NorthEast: return this.Game.Terrain.Get(position.X + Camera.NorthEast.X, position.Y + Camera.NorthEast.Y, position.Z + Camera.NorthEast.Z)
			case ViewDirection.East: return this.Game.Terrain.Get(position.X + Camera.East.X, position.Y + Camera.East.Y, position.Z + Camera.East.Z)
			case ViewDirection.SouthEast: return this.Game.Terrain.Get(position.X + Camera.SouthEast.X, position.Y + Camera.SouthEast.Y, position.Z + Camera.SouthEast.Z)
			case ViewDirection.South: return this.Game.Terrain.Get(position.X + Camera.South.X, position.Y + Camera.South.Y, position.Z + Camera.South.Z)
			case ViewDirection.SouthWest: return this.Game.Terrain.Get(position.X + Camera.SouthWest.X, position.Y + Camera.SouthWest.Y, position.Z + Camera.SouthWest.Z)
			case ViewDirection.West: return this.Game.Terrain.Get(position.X + Camera.West.X, position.Y + Camera.West.Y, position.Z + Camera.West.Z)
			case ViewDirection.NorthWest:
			default: return this.Game.Terrain.Get(position.X + Camera.NorthWest.X, position.Y + Camera.NorthWest.Y, position.Z + Camera.NorthWest.Z)
		}
	}

	private ParseUseItem() {
		const target = this.CurrentTarget
		const targetHasChanged = !this.PreviousTarget.equals(target)
		if (this.HasJustBeenPressed(this.UseItemInput()))
			return new UseItemAction(this.Player, ActionState.Start, target)
		if (this.HasJustBeenReleased(this.UseItemInput()))
			return new UseItemAction(this.Player, ActionState.End, target)
		if (this.BoolStateFor(this.UseItemInput()) && targetHasChanged)
			return new UseItemAction(this.Player, ActionState.Unchanged, target)
		return null
	}

	private ParseUseTool() {
		const target = this.CurrentTarget
		const targetHasChanged = !this.PreviousTarget.equals(target)
		const primaryState = this.ActionStateFor(this.ToolPrimaryInput())
		const secondaryState = this.ActionStateFor(this.ToolSecondaryInput())

		if (primaryState !== ActionState.Unchanged || secondaryState !== ActionState.Unchanged || this.ShouldUpdateToolTarget(targetHasChanged))
			return new UseToolAction(this.Player, primaryState, secondaryState, target)
		return null
	}

	private ActionStateFor(input: Input) {
		if (this.HasJustBeenPressed(input))
			return ActionState.Start
		if (this.HasJustBeenReleased(input))
			return ActionState.End
		return ActionState.Unchanged
	}

	private ShouldUpdateToolTarget(targetHasChanged: boolean) {
		return targetHasChanged && (this.BoolStateFor(this.ToolPrimaryInput()) || this.BoolStateFor(this.ToolSecondaryInput()))
	}

	private ActionInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeAction
			: Input.Action
	}

	private UseItemInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeUseItem
			: Input.UseItem
	}

	private ToolPrimaryInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeToolPrimary
			: Input.ToolPrimary
	}

	private ToolSecondaryInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeToolSecondary
			: Input.ToolSecondary
	}

	private MoveUpInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveUp
			: Input.MoveUp
	}

	private MoveDownInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveDown
			: Input.MoveDown
	}

	private MoveLeftInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveLeft
			: Input.MoveLeft
	}

	private MoveRightInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveRight
			: Input.MoveRight
	}

	//////////////////////////////// SELECTION ////////////////////////////////

	private ParseSelectItem() {
		const selectableItems = this.Game.Entities.SelectableItems.Get.Of(this.Player)
		if (!selectableItems)
			return null

		const currentItem = selectableItems.CurrentItemInSet
		if (this.HasJustBeenPressed(Input.SelectNextItem))
			return new SelectItemAction(this.Player, currentItem + 1)
		if (this.HasJustBeenPressed(Input.SelectPreviousItem))
			return new SelectItemAction(this.Player, currentItem - 1)

		if (this.HasJustBeenPressed(this.SelectTopItemInput()))
			return this.State.InputMode == InputMode.Selection && currentItem === 0
				? new SelectItemSetAction(this.Player, 0)
				: new SelectItemAction(this.Player, 0)
		if (this.HasJustBeenPressed(this.SelectRightItemInput()))
			return this.State.InputMode == InputMode.Selection && currentItem === 1
				? new SelectItemSetAction(this.Player, 1)
				: new SelectItemAction(this.Player, 1)
		if (this.HasJustBeenPressed(this.SelectBottomItemInput()))
			return this.State.InputMode == InputMode.Selection && currentItem === 2
				? new SelectItemSetAction(this.Player, 2)
				: new SelectItemAction(this.Player, 2)
		if (this.HasJustBeenPressed(this.SelectLeftItemInput()))
			return this.State.InputMode == InputMode.Selection && currentItem === 3
				? new SelectItemSetAction(this.Player, 3)
				: new SelectItemAction(this.Player, 3)
	}

	private ParseSelectTool() {
		if (this.HasJustBeenPressed(this.SelectTopToolInput()))
			return new SelectToolAction(this.Player, 0)
		if (this.HasJustBeenPressed(this.SelectRightToolInput()))
			return new SelectToolAction(this.Player, 1)
		if (this.HasJustBeenPressed(this.SelectBottomToolInput()))
			return new SelectToolAction(this.Player, 2)
		if (this.HasJustBeenPressed(this.SelectLeftToolInput()))
			return new SelectToolAction(this.Player, 3)
	}

	private SelectTopItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectTopItem
			: Input.SelectTopItem
	}

	private SelectRightItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectRightItem
			: Input.SelectRightItem
	}

	private SelectBottomItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectBottomItem
			: Input.SelectBottomItem
	}

	private SelectLeftItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectLeftItem
			: Input.SelectLeftItem
	}

	private SelectTopToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectTopTool
			: Input.SelectTopTool
	}

	private SelectRightToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectRightTool
			: Input.SelectRightTool
	}

	private SelectBottomToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectBottomTool
			: Input.SelectBottomTool
	}

	private SelectLeftToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectLeftTool
			: Input.SelectLeftTool
	}
}
