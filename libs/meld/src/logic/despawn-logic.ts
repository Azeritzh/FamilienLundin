import { GameLogic, Id } from "@lundin/age"
import { GameUpdate } from "../state/game-update"
import { Globals } from "../state/globals"
import { MeldEntities } from "../state/meld-entities"

export class DespawnLogic implements GameLogic<GameUpdate> {
	constructor(
		private Globals: Globals,
		private Entities: MeldEntities,
	) { }

	update() {
		for (const [entity, time] of this.Entities.With.DespawnTime)
			if (time <= this.Globals.Tick)
				this.Despawn(entity)
	}

	private Despawn(entity: Id) {
		this.Entities.Remove(entity)
	}
}
