import { MeldConstants } from "./meld-constants"
import { GroupedEntityValues } from "./state/entity-values"
import { GroupedNonSolidBlockValues } from "./state/non-solid-block-values"
import { GroupedSolidBlockValues } from "./state/solid-block-values"

export class MeldConfig {
	constructor(
		public readonly constants = new MeldConstants(),
		public readonly typeClasses: { [key: string]: string } = {},
		public readonly typeValues: { [key: string]: GroupedEntityValues } = {},
		public readonly classValues: { [key: string]: GroupedEntityValues } = {},
		public readonly solidBlockValues: { [key: string]: GroupedSolidBlockValues } = {},
		public readonly nonSolidBlockValues: { [key: string]: GroupedNonSolidBlockValues } = {},
	) { }
}
