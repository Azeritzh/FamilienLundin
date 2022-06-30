import { BaseInputParser, DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { GenerateAction, MoveAction, SelectNextItemAction, PlaceBlockAction } from "../state/meld-action"
import { Camera } from "./camera"
import { DisplayState } from "./display-state"

export class InputParser extends BaseInputParser<Input> {
	constructor(
		private game: Meld,
		private state: DisplayState,
		private camera: Camera,
		displayProvider: DisplayProvider,
		inputs: Map<Input, string[]>,
	) {
		super(displayProvider, inputs)
	}

	parseInputs() {
		this.updateActionStates()
		return [
			this.parseGenerate(),
			this.parseMovement(),
			this.parseSelectNextItem(),
			this.parsePlaceBlock(),
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
		return new MoveAction(this.game.state.players.get(this.state.playerName), velocity)
	}

	private parseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private parsePlaceBlock() {
		const position = this.camera.tilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		if (this.hasJustBeenPressed(Input.UseItem))
			return new PlaceBlockAction(this.game.state.players.get(this.state.playerName), position)
	}

	private parseSelectNextItem() {
		if (this.hasJustBeenPressed(Input.SelectNextItem))
			return new SelectNextItemAction(this.game.state.players.get(this.state.playerName))
	}
}

export enum Input {
	Generate,
	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,
	SelectNextItem,
	UseItem,
	Run,
}
