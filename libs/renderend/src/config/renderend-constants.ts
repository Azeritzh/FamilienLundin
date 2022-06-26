import { Id } from "@lundin/age"

export class RenderendConstants {
	constructor(
		public shipType: Id,
		public wallType: Id,
		public obstacleTypes: Id[],
		public maxVerticalSpeed = 0.1,
		public minHorisontalSpeed = 0.05,
		public maxHorisontalSpeed = 0.25,
	) { }
}