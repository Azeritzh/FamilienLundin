import { DisplayState, InputMode, LookingMode } from "../state/display-state"
import { Camera } from "./camera"
import { Input } from "./input"
import { InputParser } from "./input-parser"
import { Visibility } from "./visibility"

export class CameraInputHandler {
	constructor(
		private State: DisplayState,
		private Camera: Camera,
		private Visibility: Visibility,
		private Inputs: InputParser,
	) { }

	Update() {
		const State = this.State
		if (State.InputMode === InputMode.Chat)
			return
		if (this.Inputs.HasJustBeenPressed(this.RotateRightInput())) {
			this.Camera.RotateCamera(1)
			this.Visibility.UpdateSize()
		}
		if (this.Inputs.HasJustBeenPressed(this.RotateLeftInput())) {
			this.Camera.RotateCamera(-1)
			this.Visibility.UpdateSize()
		}
		const oldMode = State.LookingMode
		if (this.Inputs.BoolStateFor(this.LookUpInput()))
			State.LookingMode = LookingMode.Up
		else if (this.Inputs.BoolStateFor(this.LookDownInput()))
			State.LookingMode = LookingMode.Down
		else
			State.LookingMode = LookingMode.Normal
		if (oldMode != State.LookingMode)
			this.Visibility.UpdateSize()
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

	private LookUpInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeLookUp
			: Input.LookUp
	}

	private LookDownInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeLookDown
			: Input.LookDown
	}
}
