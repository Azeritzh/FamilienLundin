import { BaseGame, Random } from "@lundin/age"
import { defaultConstants, defaultValues } from "./defaults"
import { CollisionLogic } from "./logic/collision-logic"
import { DeathLogic } from "./logic/death-logic"
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
import { RenderendEntities } from "./state/renderend-entities"
import { RenderendState } from "./state/renderend-state"

export class Renderend extends BaseGame<RenderendAction> {
	constructor(
		public readonly config = RenderendConfig.from(defaultConstants, defaultValues),
		public readonly state = new RenderendState(new Globals(), new EntityValues()),
		readonly changes = new RenderendChanges(new EntityValues()),
		public readonly entities = new RenderendEntities(config.typeValues, config.typeBehaviours, state.entityValues, changes.updatedEntityValues, state),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
	) {
		super([ // Order depends on usage of globals variables and priority of changes to same values
			new DifficultyLogic(
				state.globals,
			),
			new MoveShipLogic(
				config.constants,
				state.globals,
				entities,
				entities.position.get,
				entities.velocity.set,
			),
			new CollisionLogic(
				entities,
				entities.position.get,
				entities.rectangularSize.get,
				[
					new DeathLogic(
						config.typeBehaviours,
						state.globals,
						entities.velocity.set,
					)
				],
			),
			new ObstacleLogic(
				config.constants,
				state.globals,
				entities,
				entities.position.get,
				entities.rectangularSize.get,
				entities.position.set,
				entities.velocity.set,
				random,
			),
			new VelocityLogic(
				entities,
				entities.position.get,
				entities.velocity.get,
				entities.position.set,
			),
			new StartLogic(
				config.constants,
				changes,
				state.globals,
				entities,
				entities.position.set,
			),
			new UpdateStateLogic(state, entities),
		])
	}
}
