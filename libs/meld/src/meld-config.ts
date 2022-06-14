import { MeldConstants } from "./meld-constants"
import { Behaviour, GroupedEntityValues } from "./state/entity-values"
import { BlockValues } from "./state/block-values"
import { BaseConfig, Id } from "@lundin/age"

export class MeldConfig extends BaseConfig<BlockValues, GroupedEntityValues, Behaviour> {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly typeBehaviours: Map<Id, Behaviour[]>,
		public readonly blockValues: Map<Id, BlockValues>,
	) { super(typeValues, typeBehaviours, blockValues) }
}
