import { AgEngine, TypeMap } from "@lundin/age"
import { StartLogic } from "./logic/start-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { RenderendConfig } from "./renderend-config"
import { RenderendAction } from "./state/renderend-action"
import { RenderendState } from "./state/renderend-state"

export class Renderend {
	private engine: AgEngine<RenderendAction>

	constructor(
		public config = new RenderendConfig(TypeMap.from(["ship", "obstacle"])),
		public state = RenderendState.fromConfig(config),
	) {
		this.engine = new AgEngine<RenderendAction>(
			[
				new StartLogic(config, state),
				new VelocityLogic(state),
			],
			[],
			this.state)
	}

	update(...actions: RenderendAction[]) {
		this.engine.update(...actions)
	}
}
