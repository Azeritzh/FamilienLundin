import { BaseGame, Random } from "@lundin/age"
import { defaultConstants, defaultValues } from "./defaults"
import { CollisionLogic } from "./logic/collision-logic"
import { DamageLogic } from "./logic/damage-logic"
import { DeathLogic } from "./logic/death-logic"
import { DifficultyLogic } from "./logic/difficulty-logic"
import { GameOverLogic } from "./logic/game-over-logic"
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
		public readonly entities = new RenderendEntities(config.typeValues, state.entityValues, changes.updatedEntityValues, state),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
		public collisionLogic = new CollisionLogic(
			entities,
			entities.position.get,
			entities.rectangularSize.get,
		),
		public damageLogic = new DamageLogic(
			entities.damage.get,
			entities.health.get,
			entities.health.set,
		),
		public deathLogic = new DeathLogic(
			entities,
			entities.health.get,
		),
		public difficultyLogic = new DifficultyLogic(
			state.globals,
		),
		public gameOverLogic = new GameOverLogic(
			state.globals,
			entities.shipBehaviour.get,
		),
		public moveShipLogic = new MoveShipLogic(
			config.constants,
			state.globals,
			entities,
			entities.position.get,
			entities.velocity.set,
		),
		public obstacleLogic = new ObstacleLogic(
			config.constants,
			state.globals,
			entities,
			entities.position.get,
			entities.rectangularSize.get,
			entities.position.set,
			entities.velocity.set,
			random,
		),
		public startLogic = new StartLogic(
			config.constants,
			changes,
			state.globals,
			entities,
			entities.position.set,
		),
		public updateStateLogic = new UpdateStateLogic(
			state,
			entities,
		),
		public velocityLogic = new VelocityLogic(
			entities,
			entities.position.get,
			entities.position.set,
		),
	) {
		super([ // Order depends on usage of globals variables and priority of changes to same values
			difficultyLogic,
			moveShipLogic,
			collisionLogic,
			obstacleLogic,
			velocityLogic,
			deathLogic,
			startLogic,
			updateStateLogic,
		])
		collisionLogic.listeners.push(damageLogic)
		deathLogic.listeners.push(gameOverLogic)
	}
}
