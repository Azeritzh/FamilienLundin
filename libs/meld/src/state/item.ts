import { Id } from "@lundin/age"

export type ItemTypeId = number

export class Item {
	static TypeOffset = 0

	constructor(
		public Type: ItemTypeId,
		public Content: Id,
		public Amount: number,
	) { }

	static From(object: any) {
		return Object.assign(new Item(0, 0, 0), object)
	}
}

export interface ItemValues {
	Kind: ItemKind
}

export enum ItemKind { Solid = 0, Hammer = 1, Sword = 2, Bow = 3 }

export function ItemValuesFrom(serialised: any): ItemValues {
	return {
		Kind: <any>ItemKind[serialised.Kind], // converting from string to number (enum), even if vscode thinks otherwise
	}
}
