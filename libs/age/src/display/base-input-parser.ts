import { DisplayProvider } from "./html-display-provider"

export abstract class BaseInputParser<Input> {
	constructor(
		protected displayProvider: DisplayProvider,
		private inputs: Map<Input, string[]>,
		private actionStates = new Map<Input, number>(),
		private previousStates = new Map<Input, number>(),
	) { }

	protected updateActionStates() {
		this.previousStates = this.actionStates
		this.actionStates = new Map()
		for (const [input, keys] of this.inputs)
			this.actionStates.set(input, this.stateFor(...keys))
	}

	private stateFor(...keys: string[]) {
		return keys.map(x => this.displayProvider.getInputState(x)).max()
	}

	protected floatStateFor(input: Input) {
		return this.actionStates.get(input)
	}

	protected boolStateFor(input: Input) {
		return this.actionStates.get(input) > 0.5
	}

	protected hasJustBeenPressed(input: Input) {
		return this.actionStates.get(input) > 0.5
			&& this.previousStates.get(input) <= 0.5
	}

	protected hasJustBeenReleased(input: Input) {
		return this.actionStates.get(input) <= 0.5
			&& this.previousStates.get(input) > 0.5
	}
}
