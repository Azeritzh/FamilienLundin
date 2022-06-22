import { GameLogic, Id, ValueGetter } from "@lundin/age"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class DeathLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private health: ValueGetter<number>,
		public listeners: DeathListener[] = [],
	) { }

	update() {
		for (const [entity] of this.entities.with.health)
			if (this.health.currentlyOf(entity) <= 0)
				this.kill(entity)
	}

	private kill(entity: Id) {
		for(const listener of this.listeners)
			listener.onDeath(entity)
		this.entities.remove(entity)
	}
}

export interface DeathListener {
	onDeath: (entity: Id) => void
}
