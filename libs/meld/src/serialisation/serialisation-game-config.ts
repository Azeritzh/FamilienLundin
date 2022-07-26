import { CircularSize, EntityTypeOffset, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameConfig } from "../config/game-config"
import { updatesPerSecond } from "../meld-game"
import { NonSolidOffset, SolidOffset } from "../state/block"
import { GroupedEntityValues } from "../state/entity-values"
import { ItemKind, ItemValues } from "../state/item"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"

export function readGameConfig(deserialised: any) {
	const entityTypeNames = Object.keys(deserialised.entityTypes)
	const entityTypeMap = TypeMap.From(EntityTypeOffset, entityTypeNames)
	const solidTypeNames = Object.keys(deserialised.solidTypes)
	const solidTypeMap = TypeMap.From(SolidOffset, solidTypeNames)
	const nonSolidTypeNames = Object.keys(deserialised.nonSolidTypes)
	const nonSolidTypeMap = TypeMap.From(NonSolidOffset, nonSolidTypeNames)
	const itemTypeNames = Object.keys(deserialised.itemTypes)
	const itemTypeMap = TypeMap.From(NonSolidOffset, itemTypeNames)
	return new GameConfig(
		constantsFrom(deserialised.constants, entityTypeMap, itemTypeMap),
		entityTypeMap,
		new Map(entityTypeNames.map(x => [entityTypeMap.TypeIdFor(x), groupedEntityValuesFrom(deserialised.entityTypes[x])])),
		solidTypeMap,
		new Map(solidTypeNames.map(x => [solidTypeMap.TypeIdFor(x), { hardness: 0 }])),
		nonSolidTypeMap,
		new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.TypeIdFor(x), { hardness: 0 }])),
		itemTypeMap,
		new Map(itemTypeNames.map(x => [itemTypeMap.TypeIdFor(x), itemValuesFrom(deserialised.itemTypes[x])])),
	)
}

function constantsFrom(serialised: any, entityTypeMap: TypeMap, itemTypeMap: TypeMap) {
	return new Constants(
		entityTypeMap.TypeIdFor(serialised.playerType),
		itemTypeMap.TypeIdFor(serialised.solidItemType),
		Object.assign(new Vector3(50, 50, 5), serialised.chunkSize ?? {}),
		serialised.chunkLoadingRadius ?? 1,
		serialised.collisionAreaWidth ?? 1 / 1024,
		(serialised.gravityAcceleration ?? 0.5) / updatesPerSecond,
		(serialised.terminalVerticalVelocity ?? 10) / updatesPerSecond,
		(serialised.maxMoveSpeed ?? 8) / updatesPerSecond,
		(serialised.acceleration ?? 3) / updatesPerSecond,
		(serialised.initialDashCharge ?? 30) / updatesPerSecond,
		(serialised.maxDashCharge ?? 50) / updatesPerSecond,
		(serialised.dashChargeSpeed ?? 1) / updatesPerSecond,
		Math.floor((serialised.dashDuration ?? 12 / 60) * updatesPerSecond),
		Math.floor((serialised.dashCooldown ?? 1) * updatesPerSecond),
		Math.floor((serialised.quickDashWindowStart ?? 6 / 60) * updatesPerSecond),
		Math.floor((serialised.quickDashWindowEnd ?? 60 / 60) * updatesPerSecond),
		serialised.quickDashMinimumAngle ?? Math.PI / 4,
	)
}

function groupedEntityValuesFrom(serialised: any): GroupedEntityValues {
	return { // Remember to add stuff in game state serialisation
		CircularSize: serialised.circularSize ? Object.assign(new CircularSize(0, 0), serialised.circularSize) : null,
		DashState: serialised.dashState ? Object.assign(new DashState(), serialised.dashState) : null,
		DespawnTime: serialised.despawnTime,
		Health: serialised.health,
		Orientation: serialised.orientation,
		Position: serialised.position ? Object.assign(new Vector3(0, 0, 0), serialised.position) : null,
		SelectableItems: serialised.selectableItems ? new SelectableItems([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]) : null,
		SelectableTools: serialised.selectableTools ? new SelectableTools([null, null, null, null]) : null,
		TargetVelocity: serialised.targetVelocity ? Object.assign(new Vector3(0, 0, 0), serialised.targetVelocity) : null,
		//ToolState: null
		Velocity: serialised.velocity ? Object.assign(new Vector3(0, 0, 0), serialised.velocity) : null,
		BlockCollisionBehaviour: serialised.blockCollisionBehaviour,
		GravityBehaviour: serialised.gravityBehaviour,
	}
}

function itemValuesFrom(serialised: any): ItemValues {
	return {
		Kind: <any>ItemKind[serialised.kind], // why in the world does it complain if I don't cast to any?
	}
}
