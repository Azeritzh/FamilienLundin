import { BaseInput } from "@lundin/age"
import { InputState, Vector2 } from "@lundin/utility"
import { MoveShipAction, RenderendAction, StartGameAction } from "./state/renderend-action"

export class RenderendInput extends BaseInput<RenderendAction> {
	private sizeScaling = 4

	constructor(
		private canvas: HTMLCanvasElement,
	) { super() }

	protected parseInputs(inputState: InputState) {
		return [
			this.getMoveAction(inputState),
			this.getRestartAction(inputState),
		]
	}

	private getMoveAction(inputState: InputState) {
		const velocity = new Vector2(this.getVelocityX(inputState), this.getVelocityY(inputState))
		if (!velocity.isZero())
			return new MoveShipAction(velocity)
	}

	private getVelocityY(inputState: InputState) {
		if (this.stateFor(inputState, "w", "ArrowUp"))
			return -1
		if (this.stateFor(inputState, "s", "ArrowDown"))
			return 1
		return 0
	}

	private getVelocityX(inputState: InputState) {
		if (this.stateFor(inputState, "a", "ArrowLeft"))
			return -1
		if (this.stateFor(inputState, "d", "ArrowRight"))
			return 1
		return 0
	}

	private getRestartAction(inputState: InputState) {
		const restart = this.stateFor(inputState, "Enter", "Escape")
		if (restart)
			return new StartGameAction()
	}

	clickCanvas(event: MouseEvent) {
		event.preventDefault()
		const { x, y } = this.gridPositionFromMousePosition(event)
		console.log("x: {0}, y: {1}", x, y)
		// this.game.config.click(x, y)
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = mx / this.sizeScaling
		const y = my / this.sizeScaling
		return { x, y }
	}

	restart() {
		this.nextActions.push(new StartGameAction())
	}
}