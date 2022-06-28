import { BaseInputParser } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { MoveShipAction, ShootBulletAction, StartGameAction } from "../state/renderend-action"

export class InputParser extends BaseInputParser<Input> {
	parseInputs() {
		this.updateActionStates()
		return [
			this.parseMovement(),
			this.parseRestart(),
			this.parseShot(),
		].filter(x => x)
	}

	private parseMovement() {
		const factor = this.boolStateFor(Input.MoveSlow) ? 0.5 : 1
		const up = this.floatStateFor(Input.MoveUp) ?? 0
		const down = this.floatStateFor(Input.MoveDown) ?? 0
		const left = this.floatStateFor(Input.MoveLeft) ?? 0
		const right = this.floatStateFor(Input.MoveRight) ?? 0
		const velocity = new Vector2(right - left, down - up)
			.multiply(factor)
		if (!velocity.isZero())
			return new MoveShipAction(velocity)
	}

	private parseRestart() {
		if (this.hasJustBeenPressed(Input.Restart))
			return new StartGameAction()
	}

	private parseShot() {
		if (this.hasJustBeenPressed(Input.Shoot))
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
