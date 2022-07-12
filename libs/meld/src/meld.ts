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
import { GameUpdate } from "./state/game-update"
import { Changes } from "./state/changes"
import { MeldEntities } from "./state/meld-entities"
import { GameState } from "./state/game-state"
import { LoadStateLogic } from "./logic/load-state-logic"
import { BlockCollisionLogic } from "./logic/block-collision-logic"
import { GravityLogic } from "./logic/gravity-logic"

export class Meld extends BaseGame<GameUpdate> {
	constructor(
		public readonly config: GameConfig,
		public readonly state = new GameState(new Globals(), new EntityValues()),
		public readonly changes = new Changes(new EntityValues()),
		public readonly terrain = new TerrainManager(config.Constants.ChunkSize, state.Chunks, changes.UpdatedBlocks),
		public readonly entities = new MeldEntities(config.EntityTypeValues, state.EntityValues, changes.UpdatedEntityValues, state),
		readonly random = new Random(() => state.Globals.Seed + state.Globals.Tick),
		public readonly blockCollisionLogic = new BlockCollisionLogic(
			config.Constants,
			entities,
			terrain,
			entities.CircularSize.get,
			entities.Position.get,
			entities.Velocity.get,
			entities.Velocity.set,
		),
		public readonly gravityLogic = new GravityLogic(
			config.Constants,
			entities,
			terrain,
			entities.Position.get,
			entities.Velocity.get,
			entities.Velocity.set,
		),
		public readonly loadStateLogic = new LoadStateLogic(
			state,
		),
		public readonly movementLogic = new MovementLogic(
			config.Constants,
			entities.Velocity.get,
			entities.Velocity.set,
		),
		public readonly placeBlockLogic = new PlaceBlockLogic(
			terrain,
			entities.SelectedBlock.get,
		),
		public readonly selectedItemLogic = new SelectedItemLogic(
			config,
			entities.SelectedBlock.get,
			entities.SelectedBlock.set,
		),
		public readonly startLogic = new StartLogic(
			config,
			state,
			changes,
			entities,
			terrain,
			entities.Position.set,
			random,
		),
		public readonly updateStateLogic = new UpdateStateLogic(
			state,
			entities,
			terrain,
		),
		public velocityLogic = new VelocityLogic(
			config.Constants,
			entities,
			entities.Position.get,
			entities.Position.set,
			entities.Velocity.get,
			entities.Velocity.set,
		),
	) {
		super([
			movementLogic,
			gravityLogic,
			blockCollisionLogic,
			velocityLogic,
			placeBlockLogic,
			selectedItemLogic,
			startLogic,
			updateStateLogic,
			loadStateLogic,
		])
	}
}
