import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export class RenderendConstants {
	constructor(
		public shipType: Id,
		public obstacleType: Id,
		public chunkSize: Vector3 = { x: 1, y: 1, z: 1 },
	) { }
}