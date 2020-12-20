import { AgEngine } from "@lundin/age"
import { NoughtsAndCrossesState } from "./noughts-and-crosses-state"

export class NoughtsAndCrosses {
	private engine: AgEngine<NoughtsAndCrossesAction>
	constructor() {
		this.engine = new AgEngine([], new NoughtsAndCrossesState())
	}

	update(...actions: NoughtsAndCrossesAction[]) {
		this.engine.update(actions)
	}
}

export class NoughtsAndCrossesAction { }
