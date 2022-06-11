import { BaseGlobals } from "@lundin/age"

export class Globals extends BaseGlobals {
	constructor(
		public speed = 0.1,
		public distanceTravelled = 0,
		public lastObstacle = 0,
		public tick = 0,
		public nextId = 1,
		public seed = 1,
	) {
		super(tick, nextId, seed)
	}
}
