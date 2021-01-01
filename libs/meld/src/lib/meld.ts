import { AgEngine, GameState } from "@lundin/age"

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

class MeldConfig { }
class MeldState implements GameState {
	tick: number
	finishUpdate?(): void {
		throw new Error("Method not implemented.")
	}
}
class MeldAction { }