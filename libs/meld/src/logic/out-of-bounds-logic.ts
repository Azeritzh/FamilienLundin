import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameUpdate } from "../state/game-update"
import { Globals } from "../state/globals"
import { MeldEntities } from "../state/meld-entities"

export class OutOfBoundsLogic implements GameLogic<GameUpdate> {
	constructor(
		private Globals: Globals,
		private Entities: MeldEntities,
		private Position: ValueGetter<Vector3>,
		private SetPosition: ValueSetter<Vector3>,
	) { }

	Update() {
		if (!this.Globals.WorldBounds)
			return
		for (const [entity, _] of this.Entities.With.Velocity)
			this.UpdateEntity(entity)
	}

	private UpdateEntity(entity: Id) {
		const position = this.Position.CurrentlyOf(entity)
		if (!position)
			return
		if (this.Globals.WorldBounds.Contains(position))
			return

		this.SetPosition.For(entity, this.Globals.WorldBounds.Contain(position))
	}
}
