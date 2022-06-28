import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldEntities } from "../state/entity-values"
import { MeldAction } from "../state/meld-action"

export class VelocityLogic implements GameLogic<MeldAction> {
	constructor(
		private entities: MeldEntities,
		private position: ValueGetter<Vector3>,
		private setPosition: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity, velocity] of this.entities.with.velocity)
			this.updateEntity(entity, velocity)
	}

	private updateEntity(entity: Id, velocity: Vector3) {
		if (velocity.isZero())
			return
		const position = this.position.of(entity)
		this.setPosition.for(entity, position.add(velocity))
	}
}
