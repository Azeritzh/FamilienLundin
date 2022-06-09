import { BaseGame, EntityAccessor, ValueAccessor } from "@lundin/age"
import { MoveShipLogic } from "./logic/move-ship-logic"
import { ObstacleLogic } from "./logic/obstacle-logic"
import { StartLogic } from "./logic/start-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { RenderendConfig } from "./renderend-config"
import { Behaviour } from "./state/entity-values"
import { RenderendAction } from "./state/renderend-action"
import { RenderendChanges } from "./state/renderend-changes"
import { RenderendState } from "./state/renderend-state"

export class Renderend extends BaseGame<RenderendAction> {
	constructor(
		public readonly config = RenderendConfig.from({ shipType: "ship", obstacleType: "obstacle" }, { ship: { behaviours: [Behaviour.Ship, Behaviour.Velocity] }, obstacle: { behaviours: [Behaviour.Obstacle, Behaviour.Velocity] } }),
		public readonly state = RenderendState.fromConfig(config),
		public readonly changes = new RenderendChanges(),
		public readonly access = new Access(config, state, changes),
	) {
		super([
			new StartLogic(config.constants, access.positioning, access.entities),
			new VelocityLogic(access.positioning, access.entities),
			new MoveShipLogic(access.positioning, access.entities),
			new ObstacleLogic(config.constants, access.positioning, access.entities, state),
		])
	}

	finishUpdate() {
		this.state.tick++
		this.access.entities.applyUpdatedValues()
	}
}

class Access {
	constructor(
		config: RenderendConfig,
		state: RenderendState,
		changes: RenderendChanges,
		public readonly entities = new EntityAccessor(config, state, changes),
		public readonly size = ValueAccessor.For(config, state, changes, x => x.entitySizeValues, x => x.entitySize),
		public readonly positioning = ValueAccessor.For(config, state, changes, x => x.positioningValues, x => x.positioning),
		public readonly health = ValueAccessor.For(config, state, changes, x => x.healthValues, x => x.health),
	) { }
}
