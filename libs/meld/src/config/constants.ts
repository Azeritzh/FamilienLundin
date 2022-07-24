import { TypeId } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { ItemTypeId } from "../state/item"

export class Constants {
	constructor(
		public PlayerType: TypeId,
		public SolidItemType: ItemTypeId,
		public ChunkSize: Vector3,
		public ChunkLoadingRadius: number,
		public CollisionAreaWidth: number,
		public GravityAcceleration: number,
		public TerminalVerticalVelocity: number,
		public MaxMoveSpeed: number,
		public Acceleration: number,
		public InitialDashCharge: number,
		public MaxDashCharge: number,
		public DashChargeSpeed: number,
		public DashDuration: number,
		public DashCooldown: number,
		public QuickDashWindowStart: number,
		public QuickDashWindowEnd: number,
		public QuickDashMinimumAngle: number,
	) { }
}