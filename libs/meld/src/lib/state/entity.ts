import { GroupedEntityValues } from "./entity-values"

export type EntityId = number

export interface Entity {
	type: number
	id: number
}

export abstract class BaseEntity implements Entity {
	constructor(
		public type: number,
		public id: number,
	) { }
}

export class SerialisedEntity {
	constructor(
		public type: string,
		public entityId: number,
		public values: GroupedEntityValues,
	) { }
}
