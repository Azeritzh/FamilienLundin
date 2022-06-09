export abstract class BaseGlobals {
	constructor(
		public tick = 0,
		public nextId = 1,
		public seed = 1,
	) { }
}
