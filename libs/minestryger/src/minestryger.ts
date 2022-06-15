import { BaseGame } from "@lundin/age"
import { FlagLogic } from "./logics/flag-logic"
import { LoseLogic } from "./logics/lose-logic"
import { RevealLogic } from "./logics/reveal-logic"
import { StartLogic } from "./logics/start-logic"
import { WinLogic } from "./logics/win-logic"
import { MinestrygerAction } from "./minestryger-action"
import { MinestrygerConfig } from "./minestryger-config"
import { MinestrygerState } from "./minestryger-state"

export class Minestryger extends BaseGame<MinestrygerAction> {
	constructor(
		public config = new MinestrygerConfig(30, 16, 99, true),
		public state = new MinestrygerState(config),
	) {
		super([
			new StartLogic(config, state),
			new RevealLogic(state),
			new FlagLogic(config, state),
			new LoseLogic(state),
			new WinLogic(state),
		])
	}

	finishUpdate() {
		this.state.tick++
	}
}
