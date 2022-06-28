import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldConstants } from "./meld-constants"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { updatesPerSecond } from "../meld-game"

export class MeldConfig {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly fieldValues: Map<Id, BlockValues>,
	) { }

	public static read(jsonConfig: any) {
		const typeNames = Object.keys(jsonConfig.types)
		const typeMap = TypeMap.from(typeNames)
		return new MeldConfig(
			constantsFrom(jsonConfig.constants, typeMap),
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x])])),
			new Map(),
		)
	}
}

function constantsFrom(serialised: any, typeMap: TypeMap) {
	const constants: MeldConstants = Object.assign(new MeldConstants(0), serialised)
	constants.playerType = typeMap.typeIdFor(serialised.playerType)
	if (serialised.chunkSize)
		constants.chunkSize = new Vector3(serialised.chunkSize.x, serialised.chunkSize.y, serialised.chunkSize.z)
	if (serialised.maxMoveSpeed)
		constants.maxMoveSpeed = serialised.maxMoveSpeed / updatesPerSecond
	return constants
}

function groupedEntityValuesFrom(jsonObject: any) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector3(0, 0, 0), jsonObject.position)
	if (jsonObject.rectangularSize)
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.velocity)
	return values
}
