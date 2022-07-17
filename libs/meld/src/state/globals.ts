import { Box } from "@lundin/age"

export class Globals{
	constructor(
		public Tick = 0,
		public NextId = 1,
		public Seed = 1,
		public WorldBounds: Box = null
	) { }
}
