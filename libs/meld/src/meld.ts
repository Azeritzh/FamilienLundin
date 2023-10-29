import { BaseGame, Random, TerrainManager } from "@lundin/age"
import { GameConfig } from "./config/game-config"
import { MovementLogic } from "./logic/movement-logic"
import { UseItemLogic } from "./logic/use-item-logic"
import { SelectedItemLogic } from "./logic/selected-item-logic"
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
import { DespawnLogic } from "./logic/despawn-logic"
import { LoadPlayerLogic } from "./logic/load-player-logic"
import { LoadingLogic } from "./logic/loading-logic"
import { JumpLogic } from "./logic/jump-logic"
import { SpawnMonsterLogic } from "./logic/spawn-monster-logic"
import { VariationProvider } from "./variation-provider"
import { ChangeBlockService } from "./services/change-block-service"

export class Meld extends BaseGame<GameUpdate> {
	constructor(
		private readonly variationProvider: VariationProvider,
		public readonly Config: GameConfig,
		public readonly State = new GameState(new Globals(), new EntityValues()),
		public readonly changes = new Changes(new EntityValues()),
		public readonly Terrain = new TerrainManager(Config.Constants.RegionSize(), Config.Constants.DefaultBlock, State.Regions, changes.UpdatedBlocks, State.Globals.WorldBounds),
		public readonly Entities = new MeldEntities(Config.EntityTypeValues, State.EntityValues, changes.EntityValues, State),
		readonly random = new Random(State.Globals.Tick + State.Globals.Seed),
		readonly changeBlockService = new ChangeBlockService(Terrain, variationProvider, random),

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
		public readonly despawnLogic = new DespawnLogic(
			State.Globals,
			Entities,
		),
		public readonly gravityLogic = new GravityLogic(
			Config.Constants,
			Entities,
			Terrain,
			Entities.Position.Get,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly jumpLogic = new JumpLogic(
			Config.Constants,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
		),
		public readonly loadingLogic = new LoadingLogic(
			Config,
			Config.Constants,
			State,
			Entities,
			null, // persistenceProvider,
			variationProvider
		),
		public readonly loadPlayerLogic = new LoadPlayerLogic(
			Config,
			State,
			changes,
			Entities,
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
		public readonly spawnMonsterLogic = new SpawnMonsterLogic(
			Config,
			State,
			State.Globals,
			Entities,
			Entities.Position.Get,
			Entities.Position.Set,
			random
		),
		public readonly updateStateLogic = new UpdateStateLogic(
			State,
			Entities,
			Terrain,
			random,
		),
		public readonly useItemLogic = new UseItemLogic(
			Config,
			changeBlockService,
			Entities.SelectableItems.Get,
		),
		public readonly useToolLogic = new UseToolLogic(
			Config,
			State.Globals,
			Entities,
			changeBlockService,
			Entities.DespawnTime.Set,
			Entities.Position.Get,
			Entities.Position.Set,
			Entities.SelectableTools.Get,
			Entities.ToolState.Get,
			Entities.ToolState.Set,
			Entities.Velocity.Get,
			Entities.Velocity.Set,
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
			loadingLogic,
			movementLogic,
			dashLogic,
			gravityLogic,
			jumpLogic,
			blockCollisionLogic,
			velocityLogic,
			outOfBoundsLogic,
			useItemLogic,
			useToolLogic,
			selectedItemLogic,
			selectedToolLogic,
			spawnMonsterLogic,
			despawnLogic,

			loadPlayerLogic,
			updateStateLogic,
			loadStateLogic,
		])
	}
}
