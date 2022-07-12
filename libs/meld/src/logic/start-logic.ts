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
		private config: GameConfig,
		private state: GameState,
		private changes: Changes,
		private entities: MeldEntities,
		private terrain: TerrainManager<Block>,
		private setPosition: ValueSetter<Vector3>,
		private random: Random,
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
		const types = [...this.config.solidTypeMap.Types.values()]
		this.terrain.addChunk(0, 0, 0)
		this.terrain.addChunk(0, -1, 0)
		this.terrain.addChunk(-1, 0, 0)
		this.terrain.addChunk(-1, -1, 0)
		for (const { position } of this.terrain.allFields())
			if (position.z === 0)
				if (Math.random() < 0.9)
					this.terrain.set(Blocks.NewFloor(this.random.get.in(types), 0), position.x, position.y, position.z)
				else
					this.terrain.set(Blocks.NewFull(this.random.get.in(types)), position.x, position.y, position.z)
	}

	private clearEntities() {
		for (const [entity, add] of this.changes.updatedEntityValues.entities)
			if (add)
				this.entities.remove(entity)
		this.entities.remove(...this.entities)
		this.state.players.clear()
	}

	private spawnPlayer() {
		const entity = this.entities.create(this.config.constants.playerType)
		this.setPosition.for(entity, new Vector3(5, 5, 0))
		this.state.players.set("insertPlayerName", entity)
	}
}