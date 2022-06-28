import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { updatesPerSecond } from "../meld-game"

export class MeldConstants {
	constructor(
		public playerType: Id,
		public chunkSize = new Vector3(10, 10, 5),
		public chunkLoadingRadius = 1,
		public collisionAreaWidth = 1 / 1024,
		public gravityAcceleration = 0.001,
		public terminalVerticalVelocity = 0.05,
		public maxMoveSpeed = 10 / updatesPerSecond
	) { }
}