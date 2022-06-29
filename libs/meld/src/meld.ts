import { BaseGame, Random, TerrainManager } from "@lundin/age"
import { MeldConfig } from "./config/meld-config"
import { MovementLogic } from "./logic/movement-logic"
import { RandomiseLogic } from "./logic/randomise-logic"
import { SelectedBlockLogic } from "./logic/selected-block-logic"
import { StartLogic } from "./logic/start-logic"
import { UpdateStateLogic } from "./logic/update-state-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { EntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { MeldAction } from "./state/meld-action"
import { MeldChanges } from "./state/meld-changes"
import { MeldEntities } from "./state/meld-entities"
import { MeldState } from "./state/meld-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config: MeldConfig,
		public readonly state = new MeldState(new Globals(), new EntityValues()),
		public readonly changes = new MeldChanges(new EntityValues()),
		public readonly terrain = new TerrainManager(config.constants.chunkSize, state.chunks, changes.updatedBlocks),
		public readonly entities = new MeldEntities(config.entityTypeValues, state.entityValues, changes.updatedEntityValues, state),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
		public readonly movementLogic = new MovementLogic(
			config.constants,
			entities,
			entities.velocity.set,
		),
		public readonly randomiseLogic = new RandomiseLogic(
			config,
			entities,
			terrain,
			random,
		),
		public readonly selectedBlockLogic = new SelectedBlockLogic(
			config,
			entities,
			entities.selectedBlock.set,
		),
		public readonly startLogic = new StartLogic(
			config,
			changes,
			entities,
			terrain,
			entities.position.set,
			random,
		),
		public readonly updateStateLogic = new UpdateStateLogic(
			state,
			entities,
			terrain,
		),
		public velocityLogic = new VelocityLogic(
			entities,
			entities.position.get,
			entities.position.set,
		),
	) {
		super([
			movementLogic,
			velocityLogic,
			randomiseLogic,
			selectedBlockLogic,
			startLogic,
			updateStateLogic,
		])
	}
}
