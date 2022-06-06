import { AgValues, Id } from "@lundin/age"

export class BlockValues extends AgValues {

	constructor(
		public hardnessValues: Map<Id, number> = new Map<Id, number>()
	) {
		super()
		this.register(hardnessValues)
	}

	public static from(groupedValues: Map<Id, GroupedBlockValues>) {
		const entityValues = new BlockValues()
		for (const [id, values] of groupedValues)
			entityValues.addValuesFrom(id, values)
		return entityValues
	}

	addValuesFrom(key: Id, values: GroupedBlockValues) {
		if (values.hardness !== undefined)
			this.hardnessValues.set(key, values.hardness)
	}
}

export interface GroupedBlockValues {
	hardness?: number
}