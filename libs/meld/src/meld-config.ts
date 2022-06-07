import { MeldConstants } from "./meld-constants"
import { GroupedEntityValues } from "./state/entity-values"
import { GroupedBlockValues } from "./state/block-values"
import { BaseConfig, Id } from "@lundin/age"

export class MeldConfig extends BaseConfig<GroupedEntityValues> {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly blockValues: Map<Id, GroupedBlockValues>,
	) { super(typeValues) }
}
