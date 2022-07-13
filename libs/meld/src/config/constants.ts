import { TypeId } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export class Constants {
	constructor(
		public PlayerType: TypeId,
		public ChunkSize: Vector3,
		public ChunkLoadingRadius: number,
		public CollisionAreaWidth: number,
		public GravityAcceleration: number,
		public TerminalVerticalVelocity: number,
		public MaxMoveSpeed: number,
		public Acceleration: number,
	) { }
}