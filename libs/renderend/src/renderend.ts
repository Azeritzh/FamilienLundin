import { BaseGame, EntityManager, ValueAccessor } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
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
		public readonly entities = new EntityManager(config, state, changes),
		public readonly access = new Access(config, state, changes),
	) {
		super([
			new StartLogic(config.constants, entities, access.position),
			new VelocityLogic(entities, access.position, access.velocity),
			new MoveShipLogic(entities, access.velocity),
			new ObstacleLogic(config.constants, state, entities, access.position, access.velocity),
		])
	}

	finishUpdate() {
		this.state.tick++
		this.entities.applyUpdatedValues()
	}
}

class Access {
	constructor(
		config: RenderendConfig,
		state: RenderendState,
		changes: RenderendChanges,
		public readonly size = ValueAccessor.For(config, state, changes, x => x.entitySize, x => x.entitySize),
		public readonly health = ValueAccessor.For(config, state, changes, x => x.health, x => x.health),
		public readonly orientation = ValueAccessor.For(config, state, changes, x => x.orientation, x => x.orientation, 0),
		public readonly position = ValueAccessor.For(config, state, changes, x => x.position, x => x.position),
		public readonly velocity = ValueAccessor.For(config, state, changes, x => x.velocity, x => x.velocity, new Vector2(0, 0)),
	) { }
}
