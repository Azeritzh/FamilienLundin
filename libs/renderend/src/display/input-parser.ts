import { Vector2 } from "@lundin/utility"
import { DisplayProvider } from "../renderend-game"
import { MoveShipAction, ShootBulletAction, StartGameAction } from "../state/renderend-action"
import { DisplayConfig } from "./display-config"

export class InputParser {
	constructor(
		private displayProvider: DisplayProvider,
		private config: DisplayConfig,
		private actionStates = new Map<Input, number>(),
		private previousStates = new Map<Input, number>(),
	) { }

	parseInputs() {
		this.updateActionStates()
		return this.parseActions()
	}

	private updateActionStates() {
		this.previousStates = this.actionStates
		this.actionStates = new Map()
		for (const [input, keys] of this.config.inputs)
			this.actionStates.set(input, this.stateFor(...keys))
	}

	private stateFor(...keys: string[]) {
		return keys.map(x => this.displayProvider.getInputState(x)).max()
	}

	private parseActions() {
		return [
			this.parseMovement(),
			this.parseRestart(),
			this.parseShot(),
		].filter(x => x)
	}

	private parseMovement() {
		const factor = this.boolStateFor(Input.MoveSlow) ? 0.5 : 1
		const up = this.actionStates.get(Input.MoveUp) ?? 0
		const down = this.actionStates.get(Input.MoveDown) ?? 0
		const left = this.actionStates.get(Input.MoveLeft) ?? 0
		const right = this.actionStates.get(Input.MoveRight) ?? 0
		const velocity = new Vector2(right - left, down - up)
			.multiply(factor)
		if (!velocity.isZero())
			return new MoveShipAction(velocity)
	}

	private parseRestart() {
		if (this.boolStateFor(Input.Restart))
			return new StartGameAction()
	}

	private parseShot() {
		if (this.hasJustBeenPressed(Input.Shoot))
			return new ShootBulletAction()
	}

	private boolStateFor(input: Input) {
		return this.actionStates.get(input) > 0.5
	}

	private hasJustBeenPressed(input: Input) {
		return this.actionStates.get(input) > 0.5
			&& this.previousStates.get(input) <= 0.5
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