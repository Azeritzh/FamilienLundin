import { AgEngine } from "@lundin/age"
import { RenderendConfig } from "./renderend-config"
import { RenderendAction } from "./state/renderend-action"
import { RenderendState } from "./state/renderend-state"

export class Renderend {
	private engine: AgEngine<RenderendAction>

	constructor(
		public config = new RenderendConfig(),
		public state = RenderendState.fromConfig(config),
	) {
		this.engine = new AgEngine<RenderendAction>(
			[],
			[],
			this.state)
	}

	update(...actions: RenderendAction[]) {
		this.engine.update(...actions)
	}
}
