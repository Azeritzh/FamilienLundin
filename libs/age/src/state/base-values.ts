import { Id } from "./base-config"

export abstract class BaseValues {
	protected readonly allValueMaps: Map<Id, any>[] = []

	protected register<TValue>(map: Map<Id, TValue>) {
		this.allValueMaps.push(map)
		return map
	}

	clear() {
		for (const map of this.allValueMaps)
			map.clear()
	}

	removeValuesFor(key: Id) {
		for (const map of this.allValueMaps)
			map.delete(key)
	}

	// Should only be used with same classes, but don't know how to express that generically
	addValuesFromOther(otherValues: BaseValues) {
		for (let i = 0; i < this.allValueMaps.length; i++)
			for (const [key, value] of otherValues.allValueMaps[i])
				this.allValueMaps[i].set(key, value)
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
