import { AgValues, Id, TypeMap } from "@lundin/age"

export class BlockValues extends AgValues {

	constructor(
		public hardnessValues: Map<Id, number> = new Map<Id, number>()
	) {
		super()
		this.register(hardnessValues)
	}

	public static from(typeValues: { [type: string]: GroupedBlockValues }, typeMap: TypeMap) {
		const values = new BlockValues()
		for (const [type, typeId] of typeMap.types)
			values.addValuesFrom(typeId, typeValues[type])
		return values
	}

	addValuesFrom(key: Id, values: GroupedBlockValues) {
		if (values.hardness !== undefined)
			this.hardnessValues.set(key, values.hardness)
	}
}

export class GroupedBlockValues {
	constructor(
		public hardness?: number,
	) { }
}