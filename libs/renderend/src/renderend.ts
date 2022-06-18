import { BaseGame, EntityManager, Random, ValueAccessBuilder, ValueAccessor } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { defaultConstants, defaultValues } from "./defaults"
import { DieOnCollisionLogic } from "./logic/die-on-collision-logic"
import { DifficultyLogic } from "./logic/difficulty-logic"
import { MoveShipLogic } from "./logic/move-ship-logic"
import { ObstacleLogic } from "./logic/obstacle-logic"
import { StartLogic } from "./logic/start-logic"
import { UpdateStateLogic } from "./logic/update-state-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { RenderendConfig } from "./renderend-config"
import { EntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { RenderendAction } from "./state/renderend-action"
import { RenderendChanges } from "./state/renderend-changes"
import { RenderendState } from "./state/renderend-state"

export class Renderend extends BaseGame<RenderendAction> {
	constructor(
		public readonly config = RenderendConfig.from(defaultConstants, defaultValues),
		public readonly state = new RenderendState(new Globals(), new EntityValues()),
		readonly changes = new RenderendChanges(new EntityValues()),
		public readonly entities = new EntityManager(config.typeBehaviours, state.entityValues, changes.updatedEntityValues, state),
		public readonly access = new Access(config, state, changes),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
	) {
		super([ // Order depends on usage of globals variables and priority of changes to same values
			new DifficultyLogic(state.globals),
			new MoveShipLogic(config.constants, state.globals, entities, access.position.get, access.velocity.set),
			new DieOnCollisionLogic(state.globals, entities, access.position.get, access.rectangularSize.get, access.velocity.set),
			new ObstacleLogic(config.constants, state.globals, entities, access.position.get, access.rectangularSize.get, access.position.set, access.velocity.set, random),
			new VelocityLogic(entities, access.position.get, access.velocity.get, access.position.set),
			new StartLogic(config.constants, changes, state.globals, entities, access.position.set),
			new UpdateStateLogic(state, entities),
		])
	}
}

class Access {
	constructor(
		config: RenderendConfig,
		state: RenderendState,
		changes: RenderendChanges,
		accessor = new ValueAccessBuilder(config.typeValues, state.entityValues, changes.updatedEntityValues),
		public readonly rectangularSize = accessor.for(x => x.rectangularSize, x => x.rectangularSize),
		public readonly health = accessor.for(x => x.health, x => x.health),
		public readonly orientation = accessor.for(x => x.orientation, x => x.orientation, 0),
		public readonly position = accessor.for(x => x.position, x => x.position),
		public readonly velocity = accessor.for(x => x.velocity, x => x.velocity, new Vector2(0, 0)),
	) { }
}
