import { DisplayProvider } from "./html-display-provider"

export abstract class BaseInputParser<Input> {
	constructor(
		public DisplayProvider: DisplayProvider,
		public Inputs: Map<Input, string[]>,
		private ActionStates = new Map<Input, number>(),
		private PreviousStates = new Map<Input, number>(),
		public CurrentControllerType = ControllerType.Controller
	) { }

	protected UpdateActionStates() {
		this.PreviousStates = this.ActionStates
		this.ActionStates = new Map()
		for (const [action, inputs] of this.Inputs)
			this.ActionStates.set(action, this.StateFor(...inputs))
	}

	private StateFor(...inputs: string[]) {
		let maxState = 0
		for (const input of inputs) {
			const state = this.DisplayProvider.GetInputState(input)
			if (state > maxState)
				maxState = state
			if (state > 0)
				this.UpdateCurrentControllerType(input)
		}
		return maxState
	}

	private UpdateCurrentControllerType(input: string) {
		if (ShouldBeIgnoredAsInputActivity(input))
			return
		this.CurrentControllerType = input.startsWith("Pad")
			? ControllerType.Controller
			: ControllerType.KeyboardAndMouse
	}

	public FloatStateFor(input: Input) {
		return this.ActionStates.get(input)
	}

	public BoolStateFor(input: Input) {
		return this.ActionStates.get(input) ?? 0 > 0.5
	}

	public HasJustBeenPressed(input: Input) {
		return (this.ActionStates.get(input) ?? 0) > 0.5
			&& (this.PreviousStates.get(input) ?? 0) <= 0.5
	}

	public HasJustBeenReleased(input: Input) {
		return (this.ActionStates.get(input) ?? 0) <= 0.5
			&& (this.PreviousStates.get(input) ?? 0) > 0.5
	}
}

export enum ControllerType { KeyboardAndMouse, Controller }

function ShouldBeIgnoredAsInputActivity(input: string) {
	switch (input) {
		case "MouseX":
		case "MouseY":
			return true
		default:
			return false
	}
}
