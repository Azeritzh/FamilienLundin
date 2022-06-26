import { GameLogic, Id, ValueSetter } from "@lundin/age"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class ChargeLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private setCharge: ValueSetter<number>,
	) { }

	update() {
		for (const [entity, charge] of this.entities.with.charge)
			this.chargeEntity(entity, charge)
	}

	private chargeEntity(entity: Id, charge: number) {
		if (charge < 4)
			this.setCharge.for(entity, charge + 1/32)
	}
}
