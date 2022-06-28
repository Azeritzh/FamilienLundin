import { Id } from "@lundin/age"
import { updatesPerSecond } from "../renderend-game"

export class RenderendConstants {
	constructor(
		public shipType: Id,
		public wallType: Id,
		public obstacleTypes: Id[],
		public initialSpeed = 6 / updatesPerSecond,
		public acceleration = 0.006 / updatesPerSecond,
		public maxVerticalSpeed = 6 / updatesPerSecond,
		public minHorisontalSpeed = 3 / updatesPerSecond,
		public maxHorisontalSpeed = 15 / updatesPerSecond,
		public easyObstacleInterval = Math.floor(0.66 * updatesPerSecond),
		public mediumObstacleInterval = Math.floor(0.33 * updatesPerSecond),
		public hardObstacleInterval = Math.floor(0.25 * updatesPerSecond),
		public annoyingObstacleInterval = Math.floor(3.6 * updatesPerSecond),
		public maxCharge = 4,
		public chargeSpeed = 1 / updatesPerSecond,
	) { }
}