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
		public readonly Config: GameConfig,
		public readonly State = new GameState(new Globals(), new EntityValues()),
		public readonly changes = new Changes(new EntityValues()),
		public readonly Terrain = new TerrainManager(Config.Constants.ChunkSize, State.Chunks, changes.UpdatedBlocks),
		public readonly Entities = new MeldEntities(Config.EntityTypeValues, State.EntityValues, changes.UpdatedEntityValues, State),
		readonly random = new Random(() => State.Globals.Seed + State.Globals.Tick),
		public readonly blockCollisionLogic = new BlockCollisionLogic(
			Config.Constants,
			Entities,
			Terrain,
			Entities.CircularSize.get,
			Entities.Position.get,
			Entities.Velocity.get,
			Entities.Velocity.set,
		),
		public readonly gravityLogic = new GravityLogic(
			Config.Constants,
			Entities,
			Terrain,
			Entities.Position.get,
			Entities.Velocity.get,
			Entities.Velocity.set,
		),
		public readonly loadStateLogic = new LoadStateLogic(
			State,
		),
		public readonly movementLogic = new MovementLogic(
			Config.Constants,
			Entities.Velocity.get,
			Entities.Velocity.set,
		),
		public readonly placeBlockLogic = new PlaceBlockLogic(
			Terrain,
			Entities.SelectedBlock.get,
		),
		public readonly selectedItemLogic = new SelectedItemLogic(
			Config,
			Entities.SelectedBlock.get,
			Entities.SelectedBlock.set,
		),
		public readonly startLogic = new StartLogic(
			Config,
			State,
			changes,
			Entities,
			Terrain,
			Entities.Position.set,
			random,
		),
		public readonly updateStateLogic = new UpdateStateLogic(
			State,
			Entities,
			Terrain,
		),
		public velocityLogic = new VelocityLogic(
			Config.Constants,
			Entities,
			Entities.Position.get,
			Entities.Position.set,
			Entities.Velocity.get,
			Entities.Velocity.set,
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
