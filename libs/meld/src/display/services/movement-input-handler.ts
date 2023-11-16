import { Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { MovementAction } from "../../state/game-update"
import { AngleFromNorth, DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class MovementInputHandler implements ActionHandler {
	private PreviousMovement = Vector2.Zero

	constructor(
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		const factor = this.Inputs.BoolStateFor(Input.HoldWalk) ? 0.5 : 1
		const up = this.Inputs.FloatStateFor(this.MoveUpInput()) ?? 0
		const down = this.Inputs.FloatStateFor(this.MoveDownInput()) ?? 0
		const left = this.Inputs.FloatStateFor(this.MoveLeftInput()) ?? 0
		const right = this.Inputs.FloatStateFor(this.MoveRightInput()) ?? 0

		const baseMovement = new Vector2(right - left, down - up).rotate(AngleFromNorth(this.State.ViewDirection))
		const movement = baseMovement.lengthSquared() > 1
			? baseMovement.unitVector().multiply(factor)
			: baseMovement.multiply(factor)
		if (movement.x === this.PreviousMovement.x && movement.y === this.PreviousMovement.y)
			return null
		this.PreviousMovement = movement
		return new MovementAction(player, movement)
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
}
