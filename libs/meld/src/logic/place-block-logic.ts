import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Block } from "../state/block"
import { MeldAction, PlaceBlockAction } from "../state/meld-action"

export class PlaceBlockLogic implements GameLogic<MeldAction> {
	constructor(
		private terrain: TerrainManager<Block>,
		private selectedItem: ValueGetter<Id>
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof PlaceBlockAction)
				this.placeBlock(action.entity, action.position)
	}

	private placeBlock(entity: Id, position: Vector3) {
		const selectedBlock = this.selectedItem.of(entity)
		if(!(selectedBlock > -1))
			return
		this.terrain.set(Block.newFloor(selectedBlock, 0), position.x, position.y, position.z)
	}
}
