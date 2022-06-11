import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export class RenderendConstants {
	constructor(
		public shipType: Id,
		public obstacleType: Id,
		public maxVerticalSpeed = 0.2,
		public minHorisontalSpeed = 0.1,
		public maxHorisontalSpeed = 0.5,
		public chunkSize: Vector3 = { x: 1, y: 1, z: 1 },
	) { }
}