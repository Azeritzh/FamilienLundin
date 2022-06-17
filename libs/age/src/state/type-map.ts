import { Id, typeOffset } from "./id"

export class TypeMap {
	constructor(
		public types = new Map<string, Id>(),
	) { }

	// maybe the id generation should be split in two, so not all ids are shifted?
	public static from(types: string[]) {
		const typeMapping = new TypeMap()
		for (const [index, type] of types.entries())
			typeMapping.types.set(type, index << typeOffset)
		return typeMapping
	}

	public typeFor(typeId: Id) {
		for (const [type, id] of this.types.entries())
			if (typeId === id)
				return type
	}

	public typeIdFor(type: string): Id {
		return this.types.get(type)
	}
}
