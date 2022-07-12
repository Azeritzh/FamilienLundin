import { BaseInputParser, DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { GenerateAction, MovementAction, SelectNextItemAction, PlaceBlockAction } from "../state/game-update"
import { Camera } from "./camera"
import { DisplayState } from "./display-state"

export class InputParser extends BaseInputParser<Input> {
	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	ParseInputs() {
		this.updateActionStates()
		return [
			this.parseGenerate(),
			this.parseMovement(),
			this.parsePlaceBlock(),
			this.parseSelectNextItem(),
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
		return new MovementAction(this.Game.State.Players.get(this.State.PlayerName), velocity)
	}

	private parseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private parsePlaceBlock() {
		const position = this.Camera.TilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		if (this.hasJustBeenPressed(Input.UseItem))
			return new PlaceBlockAction(this.Game.State.Players.get(this.State.PlayerName), position)
	}

	private parseSelectNextItem() {
		if (this.hasJustBeenPressed(Input.SelectNextItem))
			return new SelectNextItemAction(this.Game.State.Players.get(this.State.PlayerName))
	}
}

export enum Input {
	Generate,
	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,
	Run,
	SelectNextItem,
	UseItem,
}
