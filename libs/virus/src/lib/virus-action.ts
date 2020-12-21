export class VirusAction {
	origin: { x: number, y: number }
	destination: { x: number, y: number }

	constructor(
		public player: number,
		originX: number,
		originY: number,
		destinationX: number,
		destinationY: number,
	) {
		this.origin = { x: originX, y: originY }
		this.destination = { x: destinationX, y: destinationY }
	}
}
