import { Box, TypeId, TypeMap } from "@lundin/age"
import { GridVector, MathF, Vector3 } from "@lundin/utility"
import { Block, BlockType, Blocks } from "../state/block"
import { ItemTypeId } from "../state/item"
import { updatesPerSecond } from "../meld-game"

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
		public MiningStartup: number,
		public MiningRecovery: number,
	) { }

	RegionSize() {
		return new Vector3(
			this.RegionSizeInChunks.X * this.ChunkSize.X,
			this.RegionSizeInChunks.Y * this.ChunkSize.Y,
			this.RegionSizeInChunks.Z * this.ChunkSize.Z
		)
	}

	static From(serialised: any, entityTypeMap: TypeMap, itemTypeMap: TypeMap, solidTypeMap: TypeMap, nonSolidTypeMap: TypeMap) {
		return new Constants(
			entityTypeMap.TypeIdFor(serialised.PlayerType),
			itemTypeMap.TypeIdFor(serialised.SolidItemType),
			Blocks.New(<any>BlockType[serialised.DefaultBlock.BlockType], solidTypeMap.TypeIdFor(serialised.DefaultBlock.Solid), nonSolidTypeMap.TypeIdFor(serialised.DefaultBlock.NonSolid)),
			Object.assign(new Vector3(2, 2, 2), serialised.RegionSizeInChunks),
			Object.assign(new Vector3(50, 50, 5), serialised.ChunkSize),
			serialised.DefaultWorldBounds ? Object.assign(new Box(-50, 50, -50, 50, -50, 50), serialised.DefaultWorldBounds) : null,
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
			(serialised.QuickDashMinimumAngle ? serialised.QuickDashMinimumAngle * MathF.Tau : MathF.Tau / 8),
			Math.floor((serialised.MiningStartup ?? 20 / 60) * updatesPerSecond),
			Math.floor((serialised.MiningRecovery ?? 10 / 60) * updatesPerSecond),
		)
	}
}
