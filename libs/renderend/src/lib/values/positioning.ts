import { Vector2 } from "@lundin/utility"

export class Positioning { // struct
	constructor(
		public readonly position: Vector2,
		public readonly velocity: Vector2,
		public readonly orientation: number,
	) { }

	static from(
		x: number,
		y: number,
		orientation: number,
	) {
		return new Positioning(new Vector2(x, y), new Vector2(0, 0), orientation)
	}

	hasVelocity() {
		return this.velocity.x != 0 || this.velocity.y != 0
	}

	with(
		position: Vector2 = null,
		velocity: Vector2 = null,
		orientation: number = null
	) {
		return new Positioning(
			position ?? this.position,
			velocity ?? this.velocity,
			orientation ?? this.orientation)
	}
}