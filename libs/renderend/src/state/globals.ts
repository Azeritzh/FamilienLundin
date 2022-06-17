export class Globals {
	constructor(
		public isAlive = true,
		public speed = 0.1,
		public distanceTravelled = 0,
		public lastWall = -1,
		public tick = 0,
		public nextId = 1,
		public seed = 1,
	) { }
}
