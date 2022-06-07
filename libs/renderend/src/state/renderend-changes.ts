import { BaseChanges } from "@lundin/age"
import { EntityValues } from "./entity-values"

export class RenderendChanges extends BaseChanges<EntityValues> {
	constructor() {
		super(new EntityValues())
	}
}
