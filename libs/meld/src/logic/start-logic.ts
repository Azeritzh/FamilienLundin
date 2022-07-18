import { Box, GameLogic, Random, TerrainManager, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks } from "../state/block"
import { Changes } from "../state/changes"
import { GameState } from "../state/game-state"
import { GameUpdate, GenerateAction } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"

export class StartLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private State: GameState,
		private Changes: Changes,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block>,
		private SetPosition: ValueSetter<Vector3>,
		private Random: Random,
	) { }

	update(actions: GameUpdate[]) {
		if (actions.some(x => x instanceof GenerateAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.generateRandomTerrain()
		this.clearEntities()
		this.spawnPlayer()
	}

	private generateRandomTerrain() {
		const types = [...this.Config.SolidTypeMap.Types.values()]
		this.Terrain.AddChunk(0, 0, 0)
		this.Terrain.AddChunk(0, -1, 0)
		this.Terrain.AddChunk(-1, 0, 0)
		this.Terrain.AddChunk(-1, -1, 0)
		this.Terrain.AddChunk(0, 0, -1)
		this.Terrain.AddChunk(0, -1, -1)
		this.Terrain.AddChunk(-1, 0, -1)
		this.Terrain.AddChunk(-1, -1, -1)
		for (const { position } of this.Terrain.AllFields())
			if (position.z === 0) {
				if (Math.random() < 0.1)
					this.Terrain.SetAt(position, Blocks.NewFloor(this.Random.get.in(types), 0))
				else if (Math.random() < 0.11)
					this.Terrain.SetAt(position, Blocks.NewFull(this.Random.get.in(types)))
				else
					this.Terrain.SetAt(position, Blocks.NewEmpty(0))
			}
			else if (position.z < 0) {
				if (Math.random() < 0.1)
					this.Terrain.SetAt(position, Blocks.NewFull(this.Random.get.in(types)))
				else
					this.Terrain.SetAt(position, Blocks.NewEmpty(0))
			}
		this.State.Globals.WorldBounds = new Box(-50, 50, -50, 50, -5, 5)
	}

	private clearEntities() {
		for (const [entity, add] of this.Changes.UpdatedEntityValues.Entities)
			if (add)
				this.Entities.Remove(entity)
		this.Entities.Remove(...this.Entities)
		this.State.Players.clear()
	}

	private spawnPlayer() {
		const entity = this.Entities.Create(this.Config.Constants.PlayerType)
		this.SetPosition.For(entity, new Vector3(5, 5, 0))
		this.State.Players.set("insertPlayerName", entity)
	}
}