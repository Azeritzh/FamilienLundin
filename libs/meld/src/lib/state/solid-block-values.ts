export class SolidBlockValues<TKey> {
	private readonly allValueMaps: Map<TKey, any>[] = []

	constructor(
		public hardnessValues: Map<TKey, number> = new Map<TKey, number>()
	) {
		this.Register(hardnessValues)
	}

	private Register<TValue>(map: Map<TKey, TValue>) {
		this.allValueMaps.push(map)
		return map
	}

	clear() {
		for (const map of this.allValueMaps)
			map.clear()
	}

	removeValuesFor(key: TKey) {
		for (const map of this.allValueMaps)
			map.delete(key)
	}

	addValuesFromOther(otherValues: SolidBlockValues<TKey>) {
		for (let i = 0; i < this.allValueMaps.length; i++)
			for (const [key, value] of otherValues.allValueMaps[i])
				this.allValueMaps[i].set(key, value)
	}

	addValuesFrom(key: TKey, values: GroupedSolidBlockValues) {
		if (values.hardness !== undefined)
			this.hardnessValues.set(key, values.hardness)
	}
}

export class GroupedSolidBlockValues {
	constructor(
		public hardness?: number,
	) { }
}