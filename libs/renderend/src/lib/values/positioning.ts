import { Vector3 } from "@lundin/utility"

export class Positioning { // struct
	constructor(
		public readonly position: Vector3,
		public readonly velocity: Vector3,
		public readonly orientation: number,
	) { }

	static from(
		x: number,
		y: number,
		z: number,
		orientation: number,
	) {
		return new Positioning({ x, y, z }, { x: 0, y: 0, z: 0 }, orientation)
	}

	hasVelocity() {
		return this.velocity.x != 0 || this.velocity.y != 0 || this.velocity.z != 0
	}

	with(
		position: Vector3 = null,
		velocity: Vector3 = null,
		orientation: number = null
	) {
		return new Positioning(
			position ?? this.position,
			velocity ?? this.velocity,
			orientation ?? this.orientation)
	}
}