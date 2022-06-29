import { BaseInputParser, DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { GenerateAction, MoveAction, RandomiseAction } from "../state/meld-action"
import { Camera } from "./camera"

export class InputParser extends BaseInputParser<Input> {
	constructor(
		private camera: Camera,
		displayProvider: DisplayProvider,
		inputs: Map<Input, string[]>,
	) {
		super(displayProvider, inputs)
	}

	parseInputs() {
		this.updateActionStates()
		return [
			this.parseMovement(),
			this.parseGenerate(),
			this.parseRandomise(),
		].filter(x => x)
	}

	private parseMovement() {
		const factor = this.boolStateFor(Input.Run) ? 1 : 0.5
		const up = this.floatStateFor(Input.MoveUp) ?? 0
		const down = this.floatStateFor(Input.MoveDown) ?? 0
		const left = this.floatStateFor(Input.MoveLeft) ?? 0
		const right = this.floatStateFor(Input.MoveRight) ?? 0
		const velocity = new Vector2(right - left, down - up)
			.multiply(factor)
		if (!velocity.isZero())
			return new MoveAction(velocity)
	}

	private parseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private parseRandomise() {
		const position = this.camera.tilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		if (this.hasJustBeenPressed(Input.Randomise))
			return new RandomiseAction(position)
	}
}

export enum Input {
	Generate,
	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,
	Randomise,
	Run,
}
