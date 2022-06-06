import { AgEngine, GameState } from "@lundin/age"
import { MeldConfig } from "./meld-config"

export class Meld {
	private engine: AgEngine<MeldAction>

	constructor(
		public config = new MeldConfig(),
		public state = new MeldState(),
	) {
		this.engine = new AgEngine<MeldAction>(
			[],
			[],
			this.state)
	}

	update(action: MeldAction) {
		this.engine.update(action)
	}
}

class MeldState implements GameState {
	tick: number
	finishUpdate?(): void {
		throw new Error("Method not implemented.")
	}
}
class MeldAction { }
