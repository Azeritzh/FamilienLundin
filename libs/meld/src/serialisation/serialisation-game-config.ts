import { CircularSize, EntityTypeOffset, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameConfig } from "../config/game-config"
import { updatesPerSecond } from "../meld-game"
import { NonSolidOffset, SolidOffset } from "../state/block"
import { GroupedEntityValues } from "../state/entity-values"
import { DashState } from "../values/dash-state"

export function readGameConfig(jsonConfig: any) {
	const entityTypeNames = Object.keys(jsonConfig.entityTypes)
	const entityTypeMap = TypeMap.From(EntityTypeOffset, entityTypeNames)
	const solidTypeNames = Object.keys(jsonConfig.solidTypes)
	const solidTypeMap = TypeMap.From(SolidOffset, solidTypeNames)
	const nonSolidTypeNames = Object.keys(jsonConfig.nonSolidTypes)
	const nonSolidTypeMap = TypeMap.From(NonSolidOffset, nonSolidTypeNames)
	return new GameConfig(
		constantsFrom(jsonConfig.constants, entityTypeMap),
		entityTypeMap,
		new Map(entityTypeNames.map(x => [entityTypeMap.TypeIdFor(x), groupedEntityValuesFrom(jsonConfig.entityTypes[x], solidTypeMap)])),
		solidTypeMap,
		new Map(solidTypeNames.map(x => [solidTypeMap.TypeIdFor(x), { hardness: 0 }])),
		nonSolidTypeMap,
		new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.TypeIdFor(x), { hardness: 0 }])),
	)
}

function constantsFrom(serialised: any, entityTypeMap: TypeMap) {
	return new Constants(
		entityTypeMap.TypeIdFor(serialised.playerType),
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

function groupedEntityValuesFrom(serialised: any, blockTypeMap: TypeMap): GroupedEntityValues {
	return { // Remember to add stuff in game state serialisation
		CircularSize: serialised.circularSize ? Object.assign(new CircularSize(0, 0), serialised.circularSize) : null,
		DashState: serialised.DashState ? Object.assign(new DashState(), serialised.dashState) : null,
		Health: serialised.health,
		Orientation: serialised.orientation,
		Position: serialised.position ? Object.assign(new Vector3(0, 0, 0), serialised.position) : null,
		SelectedBlock: serialised.selectedBlock ? blockTypeMap.TypeIdFor(serialised.selectedBlock) : null,
		TargetVelocity: serialised.targetVelocity ? Object.assign(new Vector3(0, 0, 0), serialised.targetVelocity) : null,
		Velocity: serialised.velocity ? Object.assign(new Vector3(0, 0, 0), serialised.velocity) : null,
		BlockCollisionBehaviour: serialised.blockCollisionBehaviour,
		GravityBehaviour: serialised.gravityBehaviour,
	}
}
