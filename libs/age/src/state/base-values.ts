import { Id } from "../values/entity"

export abstract class BaseValues {
	protected readonly AllValueMaps: Map<Id, any>[] = []

	constructor(
		public readonly Entities = new Map<Id, boolean>(),
	) { }

	protected Register<TValue>(map: Map<Id, TValue>) {
		this.AllValueMaps.push(map)
		return map
	}

	ClearValues() {
		for (const map of this.AllValueMaps)
			map.clear()
	}

	RemoveValuesFor(key: Id) {
		for (const map of this.AllValueMaps)
			map.delete(key)
	}

	// Should only be used with same classes, but don't know how to express that generically
	AddValuesFromOther(otherValues: BaseValues) {
		for (let i = 0; i < this.AllValueMaps.length; i++)
			for (const [key, value] of otherValues.AllValueMaps[i])
				this.AllValueMaps[i].set(key, value)
	}

	/*where(predicate: (key: Id) => boolean): AgValues {
		const newValues = new AgValues()
		for (let i = 0; i < this.allValueMaps.length; i++)
			for (const [key, value] of this.allValueMaps[i])
				if (predicate(key))
					newValues.allValueMaps[i].set(key, value)
		return newValues
	}*/
}
