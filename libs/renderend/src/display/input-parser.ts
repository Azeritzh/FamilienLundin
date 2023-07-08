import { BaseInputParser } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { MoveShipAction, ShootBulletAction, StartGameAction } from "../state/renderend-action"

export class InputParser extends BaseInputParser<Input> {
	parseInputs() {
		this.UpdateActionStates()
		return [
			this.parseMovement(),
			this.parseRestart(),
			this.parseShot(),
		].filter(x => x)
	}

	private parseMovement() {
		const factor = this.BoolStateFor(Input.MoveSlow) ? 0.5 : 1
		const up = this.FloatStateFor(Input.MoveUp) ?? 0
		const down = this.FloatStateFor(Input.MoveDown) ?? 0
		const left = this.FloatStateFor(Input.MoveLeft) ?? 0
		const right = this.FloatStateFor(Input.MoveRight) ?? 0
		const velocity = new Vector2(right - left, down - up)
			.multiply(factor)
		if (!velocity.isZero())
			return new MoveShipAction(velocity)
	}

	private parseRestart() {
		if (this.HasJustBeenPressed(Input.Restart))
			return new StartGameAction()
	}

	private parseShot() {
		if (this.HasJustBeenPressed(Input.Shoot))
			return new ShootBulletAction()
	}
}

export enum Input {
	Restart,
	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,
	MoveSlow,
	Shoot,
}
