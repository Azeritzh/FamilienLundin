export class CircularSize { // struct
	constructor(
		public readonly radius: number,
		public readonly height: number,
	) { }

	get Radius() { return this.radius }
	get Height() { return this.height }
}
