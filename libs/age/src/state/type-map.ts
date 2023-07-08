import { Id } from "../values/entity"

export class TypeMap {
	constructor(
		public Types = new Map<string, Id>(),
	) { }

	// maybe the id generation should be split in two, so not all ids are shifted?
	public static From(
		offset: number,
		types: string[]
	) {
		const map = new TypeMap()
		for (const [index, type] of types.entries())
			map.Add(type, index << offset)
		return map
	}

	public TypeFor(typeId: Id) {
		for (const [typeName, id] of this.Types.entries())
			if (typeId === id)
				return typeName
	}

	public TypeIdFor(typeName: string): Id {
		return this.Types.get(typeName)
	}

	public Add(type: string, id: Id) {
		this.Types.set(type, id)
	}

	public get Count() {
		return this.Types.size
	}
}
