import { MoveShipHorisontallyAction, MoveShipVerticallyAction, RenderendAction, StartGameAction } from "@lundin/renderend"
import { InputState, KeyStates } from "@lundin/utility"

export class RenderendInput {
	private sizeScaling = 4
	private nextActions: RenderendAction[] = [new StartGameAction()]
	private keyStates = new KeyStates()

	constructor(
		private canvas: HTMLCanvasElement,
	) { }

	getNewActions() {
		const actions = [...this.nextActions, ...this.parseInputs(this.keyStates.getInputState())]
		this.nextActions = []
		return actions
	}

	private parseInputs(inputState: InputState) {
		return [
			this.getVerticalAction(inputState),
			this.getHorisontalAction(inputState),
			this.getRestartAction(inputState),
		]
	}

	private getVerticalAction(inputState: InputState) {
		const up = this.changesFor(inputState, "w", "ArrowUp")
		if (up === true)
			return new MoveShipVerticallyAction(-1)
		if (up === false)
			return new MoveShipVerticallyAction(0)
		const down = this.changesFor(inputState, "s", "ArrowDown")
		if (down === true)
			return new MoveShipVerticallyAction(1)
		if (down === false)
			return new MoveShipVerticallyAction(0)
	}

	private changesFor(inputState: InputState, ...keys: string[]) {
		for (const key of keys)
			if (inputState[key]?.hasChanged)
				return inputState[key].state
		return null
	}

	private getHorisontalAction(inputState: InputState) {
		const left = this.stateFor(inputState, "a", "ArrowLeft")
		if (left)
			return new MoveShipHorisontallyAction(-0.01)
		const right = this.stateFor(inputState, "d", "ArrowRight")
		if (right)
			return new MoveShipHorisontallyAction(0.01)
	}

	private getRestartAction(inputState: InputState) {
		const restart = this.stateFor(inputState, "Enter", "Escape")
		if (restart)
			return new StartGameAction()
	}

	private stateFor(inputState: InputState, ...keys: string[]) {
		for (const key of keys)
			if (inputState[key]?.state)
				return true
		return false
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
