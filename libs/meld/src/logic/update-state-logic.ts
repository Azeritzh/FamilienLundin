import { EntityManager, GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { EntityValues } from "../state/entity-values"
import { MeldAction } from "../state/meld-action"
import { MeldState } from "../state/meld-state"

export class UpdateStateLogic implements GameLogic<MeldAction> {
	constructor(
		private state: MeldState,
		private entities: EntityManager<EntityValues>,
		private terrain: TerrainManager<Block>
	) { }

	update() {
		this.state.globals.tick++
		this.entities.applyUpdatedValues()
		this.terrain.applyUpdatedValues()
	}
}