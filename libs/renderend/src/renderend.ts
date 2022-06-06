import { AgEngine } from "@lundin/age"
import { MoveShipLogic } from "./logic/move-ship-logic"
import { ObstacleLogic } from "./logic/obstacle-logic"
import { StartLogic } from "./logic/start-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { RenderendConfig } from "./renderend-config"
import { RenderendAction } from "./state/renderend-action"
import { RenderendState } from "./state/renderend-state"

export class Renderend {
	private engine: AgEngine<RenderendAction>

	constructor(
		public config = RenderendConfig.from({ shipType: "ship", obstacleType: "obstacle" }, { ship: {}, obstacle: {} }),
		public state = RenderendState.fromConfig(config),
	) {
		this.engine = new AgEngine<RenderendAction>(
			[
				new StartLogic(config, state),
				new VelocityLogic(state),
				new MoveShipLogic(config, state),
				new ObstacleLogic(config, state),
			],
			[],
			this.state)
	}

	update(...actions: RenderendAction[]) {
		this.engine.update(...actions)
	}
}
