import { AgEngine } from "@lundin/age"
import { FlagLogic } from "./logics/flag-logic"
import { LoseLogic } from "./logics/lose-logic"
import { RevealLogic } from "./logics/reveal-logic"
import { StartLogic } from "./logics/start-logic"
import { WinLogic } from "./logics/win-logic"
import { MinestrygerAction } from "./minestryger-action"
import { MinestrygerConfig } from "./minestryger-config"
import { MinestrygerState } from "./minestryger-state"

export class Minestryger {
	private engine: AgEngine<MinestrygerAction>

	constructor(
		public config = new MinestrygerConfig(30, 16, 99, true),
		public state = new MinestrygerState(config),
	) {
		this.engine = new AgEngine<MinestrygerAction>(
			[
				new StartLogic(this.config, this.state),
				new RevealLogic(this.state),
				new FlagLogic(this.config, this.state),
				new LoseLogic(this.state),
				new WinLogic(this.state),
			],
			[],
			this.state)
	}

	update(action: MinestrygerAction) {
		this.engine.update(action)
	}
}
