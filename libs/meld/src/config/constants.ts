import { TypeId } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { updatesPerSecond } from "../meld-game"

export class Constants {
	constructor(
		public PlayerType: TypeId,
		public ChunkSize = new Vector3(50, 50, 5),
		public ChunkLoadingRadius = 1,
		public CollisionAreaWidth = 1 / 1024,
		public GravityAcceleration = 0.5 / updatesPerSecond,
		public TerminalVerticalVelocity = 10 / updatesPerSecond,
		public MaxMoveSpeed = 10 / updatesPerSecond
	) { }
}