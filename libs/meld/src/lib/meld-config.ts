import { MeldConstants } from "./meld-constants"
import { GroupedEntityValues } from "./state/entity-values"
import { GroupedBlockValues } from "./state/block-values"

export class MeldConfig {
	constructor(
		public readonly constants = new MeldConstants(),
		public readonly typeValues: { [key: string]: GroupedEntityValues } = {},
		public readonly blockValues: { [key: string]: GroupedBlockValues } = {},
	) { }
}
