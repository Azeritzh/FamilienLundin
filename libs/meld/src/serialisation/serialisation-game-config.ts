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
	const entityTypeNames = Object.keys(deserialised.EntityTypes)
	const entityTypeMap = TypeMap.From(EntityTypeOffset, entityTypeNames)
	const solidTypeNames = Object.keys(deserialised.SolidTypes)
	const solidTypeMap = TypeMap.From(SolidOffset, solidTypeNames)
	const nonSolidTypeNames = Object.keys(deserialised.NonSolidTypes)
	const nonSolidTypeMap = TypeMap.From(NonSolidOffset, nonSolidTypeNames)
	const itemTypeNames = Object.keys(deserialised.ItemTypes)
	const itemTypeMap = TypeMap.From(NonSolidOffset, itemTypeNames)
	return new GameConfig(
		constantsFrom(deserialised.Constants, entityTypeMap, itemTypeMap),
		entityTypeMap,
		new Map(entityTypeNames.map(x => [entityTypeMap.TypeIdFor(x), groupedEntityValuesFrom(deserialised.EntityTypes[x])])),
		solidTypeMap,
		new Map(solidTypeNames.map(x => [solidTypeMap.TypeIdFor(x), { Hardness: 0 }])),
		nonSolidTypeMap,
		new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.TypeIdFor(x), { Hardness: 0 }])),
		itemTypeMap,
		new Map(itemTypeNames.map(x => [itemTypeMap.TypeIdFor(x), itemValuesFrom(deserialised.ItemTypes[x])])),
	)
}

function constantsFrom(serialised: any, entityTypeMap: TypeMap, itemTypeMap: TypeMap) {
	return new Constants(
		entityTypeMap.TypeIdFor(serialised.PlayerType),
		itemTypeMap.TypeIdFor(serialised.SolidItemType),
		Object.assign(new Vector3(50, 50, 5), serialised.ChunkSize ?? {}),
		serialised.ChunkLoadingRadius ?? 1,
		serialised.CollisionAreaWidth ?? 1 / 1024,
		(serialised.GravityAcceleration ?? 0.5) / updatesPerSecond,
		(serialised.TerminalVerticalVelocity ?? 10) / updatesPerSecond,
		(serialised.MaxMoveSpeed ?? 8) / updatesPerSecond,
		(serialised.Acceleration ?? 3) / updatesPerSecond,
		(serialised.InitialDashCharge ?? 30) / updatesPerSecond,
		(serialised.MaxDashCharge ?? 50) / updatesPerSecond,
		(serialised.DashChargeSpeed ?? 1) / updatesPerSecond,
		Math.floor((serialised.DashDuration ?? 12 / 60) * updatesPerSecond),
		Math.floor((serialised.DashCooldown ?? 1) * updatesPerSecond),
		Math.floor((serialised.QuickDashWindowStart ?? 6 / 60) * updatesPerSecond),
		Math.floor((serialised.QuickDashWindowEnd ?? 60 / 60) * updatesPerSecond),
		serialised.QuickDashMinimumAngle ?? Math.PI / 4,
	)
}

function groupedEntityValuesFrom(serialised: any): GroupedEntityValues {
	return { // Remember to add stuff in game state serialisation
		CircularSize: serialised.CircularSize ? Object.assign(new CircularSize(0, 0), serialised.CircularSize) : null,
		DashState: serialised.DashState ? Object.assign(new DashState(), serialised.DashState) : null,
		DespawnTime: serialised.DespawnTime,
		Health: serialised.Health,
		Orientation: serialised.Orientation,
		Position: serialised.Position ? Object.assign(new Vector3(0, 0, 0), serialised.Position) : null,
		SelectableItems: serialised.SelectableItems ? new SelectableItems([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]) : null,
		SelectableTools: serialised.SelectableTools ? new SelectableTools([null, null, null, null]) : null,
		TargetVelocity: serialised.TargetVelocity ? Object.assign(new Vector3(0, 0, 0), serialised.TargetVelocity) : null,
		//ToolState: null
		Velocity: serialised.Velocity ? Object.assign(new Vector3(0, 0, 0), serialised.Velocity) : null,
		BlockCollisionBehaviour: serialised.BlockCollisionBehaviour,
		GravityBehaviour: serialised.GravityBehaviour,
	}
}

function itemValuesFrom(serialised: any): ItemValues {
	return {
		Kind: <ItemKind>serialised.Kind,
	}
}
