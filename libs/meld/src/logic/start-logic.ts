import { GameLogic, Random, TerrainManager, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldConfig } from "../config/meld-config"
import { Block } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { GenerateAction, MeldAction } from "../state/meld-action"
import { MeldChanges } from "../state/meld-changes"

export class StartLogic implements GameLogic<MeldAction> {
	constructor(
		private config: MeldConfig,
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
		this.terrain.addChunk([], 0, 0, 0)
		const types = [...this.config.blockTypeMap.types.values()]
		types.splice(0, 1)
		for (const { x, y, z } of this.terrain.allFields())
			this.terrain.set(Block.newFull(this.random.get.in(types)), x, y, z)
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