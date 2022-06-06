import { MeldConstants } from "./meld-constants"
import { GroupedEntityValues } from "./state/entity-values"
import { GroupedBlockValues } from "./state/block-values"
import { Id } from "@lundin/age"

export class MeldConfig {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly blockValues: Map<Id, GroupedBlockValues>,
	) { }
}
