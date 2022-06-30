import { GameLogic, Random, TerrainManager, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { GenerateAction, MeldAction } from "../state/meld-action"
import { MeldChanges } from "../state/meld-changes"

export class StartLogic implements GameLogic<MeldAction> {
	constructor(
		private config: GameConfig,
		private changes: MeldChanges,
		private entities: MeldEntities,
		private terrain: TerrainManager<Block>,
		private setPosition: ValueSetter<Vector3>,
		private random: Random,
	) { }

	update(actions: MeldAction[]) {
		if (actions.some(x => x instanceof GenerateAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.generateRandomTerrain()
		this.clearEntities()
		this.spawnPlayer()
	}

	private generateRandomTerrain() {
		const types = [...this.config.solidTypeMap.types.values()]
		this.terrain.addChunk([], 0, 0, 0)
		this.terrain.addChunk([], 0, -1, 0)
		this.terrain.addChunk([], -1, 0, 0)
		this.terrain.addChunk([], -1, -1, 0)
		for (const { position } of this.terrain.allFields())
			if (position.z === 0)
				if (Math.random() < 0.9)
					this.terrain.set(Block.newFloor(this.random.get.in(types), 0), position.x, position.y, position.z)
				else
					this.terrain.set(Block.newFull(this.random.get.in(types)), position.x, position.y, position.z)
	}

	private clearEntities() {
		for (const [entity, add] of this.changes.updatedEntityValues.entities)
			if (add)
				this.entities.remove(entity)
		this.entities.remove(...this.entities)
	}

	private spawnPlayer() {
		const entity = this.entities.create(this.config.constants.playerType)
		this.setPosition.for(entity, new Vector3(5, 5, 0))
	}
}