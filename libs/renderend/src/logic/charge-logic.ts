import { GameLogic, Id, ValueSetter } from "@lundin/age"
import { RenderendConstants } from "../config/renderend-constants"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class ChargeLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private entities: RenderendEntities,
		private setCharge: ValueSetter<number>,
	) { }

	Update() {
		for (const [entity, charge] of this.entities.With.charge)
			this.chargeEntity(entity, charge)
	}

	private chargeEntity(entity: Id, charge: number) {
		if (charge < this.constants.maxCharge)
			this.setCharge.For(entity, charge + this.constants.chargeSpeed)
	}
}
