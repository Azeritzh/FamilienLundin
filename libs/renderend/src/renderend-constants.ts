import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export class RenderendConstants {
	constructor(
		public shipType: Id,
		public wallType: Id,
		public obstacleTypes: Id[],
		public maxVerticalSpeed = 0.2,
		public minHorisontalSpeed = 0.1,
		public maxHorisontalSpeed = 0.5,
	) { }
}