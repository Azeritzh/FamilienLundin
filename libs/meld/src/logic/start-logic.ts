import { GameLogic, Random, TerrainManager, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { GenerateAction, GameUpdate } from "../state/game-update"
import { Changes } from "../state/changes"
import { GameState } from "../state/game-state"

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
		this.Terrain.addChunk(0, 0, 0)
		this.Terrain.addChunk(0, -1, 0)
		this.Terrain.addChunk(-1, 0, 0)
		this.Terrain.addChunk(-1, -1, 0)
		for (const { position } of this.Terrain.allFields())
			if (position.z === 0)
				if (Math.random() < 0.9)
					this.Terrain.set(Blocks.NewFloor(this.Random.get.in(types), 0), position.x, position.y, position.z)
				else
					this.Terrain.set(Blocks.NewFull(this.Random.get.in(types)), position.x, position.y, position.z)
	}

	private clearEntities() {
		for (const [entity, add] of this.Changes.UpdatedEntityValues.entities)
			if (add)
				this.Entities.remove(entity)
		this.Entities.remove(...this.Entities)
		this.State.Players.clear()
	}

	private spawnPlayer() {
		const entity = this.Entities.create(this.Config.Constants.PlayerType)
		this.SetPosition.for(entity, new Vector3(5, 5, 0))
		this.State.Players.set("insertPlayerName", entity)
	}
}