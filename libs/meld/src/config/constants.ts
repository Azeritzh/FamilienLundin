import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { updatesPerSecond } from "../meld-game"

export class Constants {
	constructor(
		public playerType: Id,
		public chunkSize = new Vector3(50, 50, 5),
		public chunkLoadingRadius = 1,
		public collisionAreaWidth = 1 / 1024,
		public gravityAcceleration = 0.5 / updatesPerSecond,
		public terminalVerticalVelocity = 10 / updatesPerSecond,
		public maxMoveSpeed = 10 / updatesPerSecond
	) { }
}