import { TypeId, TypeMap } from "@lundin/age"

export class Lists {
	constructor(
		public readonly RandomlySpawningMonsters: TypeId[],
	) { }

	static From(serialised: any,  entityTypeMap: TypeMap) {
		return new Lists(
			serialised.RandomlySpawningMonsters?.map((x: any) => entityTypeMap.TypeIdFor(x)) ?? []
		)
	}
}
