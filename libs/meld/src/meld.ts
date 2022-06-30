import { BaseGame, Random, TerrainManager } from "@lundin/age"
import { GameConfig } from "./config/game-config"
import { MovementLogic } from "./logic/movement-logic"
import { PlaceBlockLogic } from "./logic/place-block-logic"
import { SelectedItemLogic } from "./logic/selected-item-logic"
import { StartLogic } from "./logic/start-logic"
import { UpdateStateLogic } from "./logic/update-state-logic"
import { VelocityLogic } from "./logic/velocity-logic"
import { EntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { MeldAction } from "./state/meld-action"
import { Changes } from "./state/changes"
import { MeldEntities } from "./state/meld-entities"
import { GameState } from "./state/game-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config: GameConfig,
		public readonly state = new GameState(new Globals(), new EntityValues()),
		public readonly changes = new Changes(new EntityValues()),
		public readonly terrain = new TerrainManager(config.constants.chunkSize, state.chunks, changes.updatedBlocks),
		public readonly entities = new MeldEntities(config.entityTypeValues, state.entityValues, changes.updatedEntityValues, state),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
		public readonly movementLogic = new MovementLogic(
			config.constants,
			entities,
			entities.velocity.set,
		),
		public readonly placeBlockLogic = new PlaceBlockLogic(
			config,
			entities,
			terrain,
			random,
		),
		public readonly selectedItemLogic = new SelectedItemLogic(
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
			placeBlockLogic,
			selectedItemLogic,
			startLogic,
			updateStateLogic,
		])
	}
}
