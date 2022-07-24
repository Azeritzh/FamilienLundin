import { Id } from "@lundin/age"

export type ItemTypeId = number

export class Item {
	static TypeOffset = 0

	constructor(
		public Type: ItemTypeId,
		public Content: Id,
		public Amount: number,
	) { }
}

export interface ItemValues {
	Kind: ItemKind
}

export enum ItemKind { Solid = 0, Hammer = 1, Sword = 2, Bow = 3 }
