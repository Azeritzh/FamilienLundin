import { BaseGlobals } from "@lundin/age"

export class Globals extends BaseGlobals {
	constructor(
		public speed: number,
		public tick = 0,
		public nextId = 1,
	) {
		super(tick, nextId)
	}
}
