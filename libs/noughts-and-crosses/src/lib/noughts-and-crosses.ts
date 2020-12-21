import { AgEngine } from "@lundin/age"
import { NoughtsAndCrossesAction, NoughtsAndCrossesLogic } from "./noughts-and-crosses-logic"
import { NoughtsAndCrossesState } from "./noughts-and-crosses-state"
import { NoughtsAndCrossesValidator } from "./noughts-and-crosses-validator"

export class NoughtsAndCrosses {
	readonly state: NoughtsAndCrossesState
	private readonly engine: AgEngine<NoughtsAndCrossesAction>

	constructor() {
		this.state = new NoughtsAndCrossesState()
		this.engine = new AgEngine(
			[new NoughtsAndCrossesLogic(this.state)],
			[new NoughtsAndCrossesValidator(this.state)],
			this.state)
	}

	update(action: NoughtsAndCrossesAction) {
		return this.engine.update(action)
	}
}
