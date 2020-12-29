import { AgEngine } from "@lundin/age"
import { LoseLogic } from "./logics/lose-logic"
import { RevealLogic } from "./logics/reveal-logic"
import { MinestrygerAction } from "./minestryger-action"
import { MinestrygerConfig } from "./minestryger-config"
import { MinestrygerState } from "./minestryger-state"

export class Minestryger {
	private engine: AgEngine<MinestrygerAction>

	constructor(
		public config = new MinestrygerConfig(30, 16, 99), // 16*16 40 // 9*9 10
		public state = new MinestrygerState(config),
	) {
		this.engine = new AgEngine<MinestrygerAction>(
			[
				new RevealLogic(this.state),
				new LoseLogic(this.state),
			],
			[],
			this.state)
	}

	update(action: MinestrygerAction) {
		this.engine.update(action)
	}
}
