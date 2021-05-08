import { AgEngine } from "@lundin/age"
import { KingdomsAction } from "./kingdoms-action"
import { KingdomsConfig } from "./kingdoms-config"
import { KingdomsState } from "./kingdoms-state"
import { StartLogic } from "./logics/start-logic"

export class Kingdoms {
	private engine: AgEngine<any>

	constructor(
		public config = new KingdomsConfig(30, 16),
		public state = new KingdomsState(config),
	) {
		this.engine = new AgEngine<KingdomsAction>(
			[
				new StartLogic(this.config, this.state),
			],
			[],
			this.state)
	}

	update(action: KingdomsAction) {
		this.engine.update(action)
	}
}
