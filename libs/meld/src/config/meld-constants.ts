import { Vector3 } from "@lundin/utility"

export class MeldConstants {
	constructor(
		public chunkSize = new Vector3(10, 10, 5),
		public chunkLoadingRadius = 1,
		public collisionAreaWidth = 1 / 1024,
		public gravityAcceleration = 0.001,
		public terminalVerticalVelocity = 0.05,
	) { }
}