import { InputState, KeyStates } from "@lundin/utility"

export abstract class BaseInput<Action> {
	protected nextActions: Action[] = []
	protected keyStates = new KeyStates()

	getNewActions(): Action[] {
		const actions = [...this.nextActions, ...this.parseInputs(this.keyStates.getInputState())]
		this.nextActions = []
		return actions
	}

	protected abstract parseInputs(inputState: InputState): Action[] 

	protected stateFor(inputState: InputState, ...keys: string[]) {
		for (const key of keys)
			if (inputState[key]?.state)
				return true
		return false
	}
}
