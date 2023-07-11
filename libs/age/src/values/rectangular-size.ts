export class RectangularSize { // struct
	constructor(
		public readonly width: number,
		public readonly height: number,
	) { }

	get Width() { return this.width }
	get Height() { return this.height }
}
