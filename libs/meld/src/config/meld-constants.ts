import { Vector3 } from "@lundin/utility"

export class MeldConstants {
	constructor(
		public chunkSize: Vector3 = { x: 10, y: 10, z: 10 },
		public chunkLoadingRadius = 1,
		public collisionAreaWidth = 1 / 1024,
		public gravityAcceleration = 0.001,
		public terminalVerticalVelocity = 0.05,
	) { }
}