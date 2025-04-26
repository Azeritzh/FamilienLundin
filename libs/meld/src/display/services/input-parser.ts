import { BaseInputParser, ControllerType, DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DisplayState, InputMode } from "../state/display-state"
import { Camera } from "./camera"
import { Input } from "./input"

export class InputParser extends BaseInputParser<Input> {
	public CurrentTarget = Vector3.Zero
	public PreviousTarget = Vector3.Zero
	public CurrentVector = Vector2.Zero
	public PreviousVector = Vector2.Zero
	private Player!: Id

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	Update(player: Id) {
		this.Player = player

		this.UpdateMode()
		this.UpdatePointer()
		this.UpdateActionStates()
		this.State.CurrentControllerType = this.CurrentControllerType
		this.State.PointerTarget = this.CurrentTarget
		this.State.PointerPosition = this.CurrentVector
	}

	private UpdateMode() {
		const State = this.State
		if (this.HasJustBeenPressed(Input.ToggleChat)) {
			State.InputMode = State.InputMode === InputMode.Chat
				? InputMode.Normal
				: InputMode.Chat
		}
		if (State.InputMode === InputMode.Chat)
			return
		if (this.BoolStateFor(Input.HoldCamera))
			State.InputMode = InputMode.Camera
		else if (this.BoolStateFor(Input.HoldSelection))
			State.InputMode = InputMode.Selection
		else
			State.InputMode = InputMode.Normal
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
}
