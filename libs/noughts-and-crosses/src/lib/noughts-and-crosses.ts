import { AgEngine } from "@lundin/age"
import { NoughtsAndCrossesAction, NoughtsAndCrossesLogic } from "./noughts-and-crosses-logic"
import { NoughtsAndCrossesState } from "./noughts-and-crosses-state"

export class NoughtsAndCrosses {
	readonly state: NoughtsAndCrossesState
	private readonly engine: AgEngine<NoughtsAndCrossesAction>

	constructor() {
		this.state = new NoughtsAndCrossesState()
		this.engine = new AgEngine(
			[new NoughtsAndCrossesLogic(this.state)],
			this.state)
	}

	update(action: NoughtsAndCrossesAction) {
		const validation = NoughtsAndCrossesLogic.validate(this.state, action)
		if (validation.isValid)
			this.engine.update(action)
		return validation
	}
}