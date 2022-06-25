import { Vector2 } from "@lundin/utility"
import { DisplayProvider } from "../renderend-game"
import { MoveShipAction, StartGameAction } from "../state/renderend-action"

export class InputParser {
	constructor(
		private displayProvider: DisplayProvider,
	) { }

	parseInputs() {
		return [
			this.getMoveAction(),
			this.getRestartAction(),
		]
	}

	private getMoveAction() {
		const factor = this.boolStateFor("ShiftLeft", "PadB") ? 0.5 : 1
		const velocity = new Vector2(this.getVelocityX(), this.getVelocityY())
			.multiply(factor)
		if (!velocity.isZero())
			return new MoveShipAction(velocity)
	}

	private getVelocityX() {
		const left = this.stateFor("KeyA", "ArrowLeft", "PadLeft")
		const right = this.stateFor("KeyD", "ArrowRight", "PadRight")
		return right - left
	}

	private getVelocityY() {
		const up = this.stateFor("KeyW", "ArrowUp", "PadUp")
		const down = this.stateFor("KeyS", "ArrowDown", "PadDown")
		return down - up
	}

	private getRestartAction() {
		const restart = this.boolStateFor("Enter", "Escape", "PadStart")
		if (restart)
			return new StartGameAction()
	}

	private stateFor(...keys: string[]) {
		return keys.map(x => this.displayProvider.getInputState(x)).max()
	}

	private boolStateFor(...keys: string[]) {
		return keys.map(x => this.displayProvider.getInputState(x)).max() > 0.5
	}
}
