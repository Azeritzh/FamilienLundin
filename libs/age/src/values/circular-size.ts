export class CircularSize { // struct
	constructor(
		public radius: number,
		public height: number,
	) { }

	get Radius() { return this.radius }
	set Radius(value: number) { this.radius = value }
	get Height() { return this.height }
	set Height(value: number) { this.height = value }
}
