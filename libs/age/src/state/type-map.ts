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
		const typeMapping = new TypeMap()
		for (const [index, type] of types.entries())
			typeMapping.Types.set(type, index << offset)
		return typeMapping
	}

	public TypeFor(typeId: Id) {
		for (const [type, id] of this.Types.entries())
			if (typeId === id)
				return type
	}

	public TypeIdFor(type: string): Id {
		return this.Types.get(type)
	}
}
