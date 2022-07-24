import { BaseGame, Random, TerrainManager } from "@lundin/age"
import { GameConfig } from "./config/game-config"
import { MovementLogic } from "./logic/movement-logic"
import { UseItemLogic } from "./logic/use-item-logic"
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
import { DashLogic } from "./logic/dash-logic"
import { OutOfBoundsLogic } from "./logic/out-of-bounds-logic"
import { SelectedToolLogic } from "./logic/selected-tool-logic"
import { UseToolLogic } from "./logic/use-tool-logic"

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
			Entities.CircularSize.Get,
			Entities.Position.Get,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly dashLogic = new DashLogic(
			Config.Constants,
			State.Globals,
			Entities,
			Entities.DashState.Get,
			Entities.DashState.Set,
			Entities.GravityBehaviour.Get,
			Entities.GravityBehaviour.Set,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly gravityLogic = new GravityLogic(
			Config.Constants,
			Entities,
			Terrain,
			Entities.Position.Get,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly loadStateLogic = new LoadStateLogic(
			State,
			Terrain,
		),
		public readonly movementLogic = new MovementLogic(
			Config.Constants,
			Entities,
			Entities.Orientation.Set,
			Entities.TargetVelocity.Get,
			Entities.TargetVelocity.Set,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly outOfBoundsLogic = new OutOfBoundsLogic(
			State.Globals,
			Entities,
			Entities.Position.Get,
			Entities.Position.Set,
		),
		public readonly selectedItemLogic = new SelectedItemLogic(
			Entities.SelectableItems.Get,
			Entities.SelectableItems.Set,
		),
		public readonly selectedToolLogic = new SelectedToolLogic(
			Entities.SelectableTools.Get,
			Entities.SelectableTools.Set,
		),
		public readonly startLogic = new StartLogic(
			Config,
			State,
			changes,
			Entities,
			Terrain,
			Entities.Position.Set,
			random,
		),
		public readonly updateStateLogic = new UpdateStateLogic(
			State,
			Entities,
			Terrain,
		),
		public readonly useItemLogic = new UseItemLogic(
			Config,
			Terrain,
			Entities.SelectableItems.Get,
		),
		public readonly useToolLogic = new UseToolLogic(
			Config,
			Terrain,
			Entities.SelectableTools.Get,
		),
		public velocityLogic = new VelocityLogic(
			Config.Constants,
			Entities,
			Entities.Position.Get,
			Entities.Position.Set,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
	) {
		super([
			movementLogic,
			dashLogic,
			gravityLogic,
			blockCollisionLogic,
			velocityLogic,
			outOfBoundsLogic,
			useItemLogic,
			useToolLogic,
			selectedItemLogic,
			selectedToolLogic,
			startLogic,
			updateStateLogic,
			loadStateLogic,
		])
	}
}
