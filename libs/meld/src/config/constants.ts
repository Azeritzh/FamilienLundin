import { Box, TypeId } from "@lundin/age"
import { GridVector, Vector3 } from "@lundin/utility"
import { Block } from "../state/block"
import { ItemTypeId } from "../state/item"

export class Constants {
	constructor(
		public PlayerType: TypeId,
		public SolidItemType: ItemTypeId,
		public DefaultBlock: Block,
		public RegionSizeInChunks: GridVector,
		public ChunkSize: GridVector,
		public DefaultWorldBounds: Box,
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

	RegionSize() {
		return new Vector3(
			this.RegionSizeInChunks.X * this.ChunkSize.X,
			this.RegionSizeInChunks.Y * this.ChunkSize.Y,
			this.RegionSizeInChunks.Z * this.ChunkSize.Z
		)
	}
}
