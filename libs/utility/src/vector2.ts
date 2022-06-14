import { clip } from "./utility"

export class Vector2 {
	constructor(
		public x: number,
		public y: number,
	) { }

	static fromAngle(angle: number) {
		return new Vector2(1, 0).rotate(angle) // TODO: double check that this is correct
	}

	add(vector: Vector2) {
		return new Vector2(this.x + vector.x, this.y + vector.y)
	}

	subtract(vector: Vector2) {
		return new Vector2(this.x - vector.x, this.y - vector.y)
	}

	multiply(factor: number) {
		return new Vector2(this.x * factor, this.y * factor)
	}

	rotate(angle: number) {
		return new Vector2(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle))
	}

	angle() {
		return Math.atan2(this.y, this.x)
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y
	}

	unitVector() {
		const length = this.length()
		if (length === 0)
			return new Vector2(0, 0)
		return new Vector2(this.x / length, this.y / length)
	}

	length() {
		if (this.x === 0 || this.y === 0)
			return this.x + this.y
		return Math.sqrt(this.lengthSquared())
	}

	copy() {
		return new Vector2(this.x, this.y)
	}

	clip(minX: number, minY: number, maxX: number, maxY: number, wrap = false) {
		return new Vector2(
			clip(this.x, minX, maxX, wrap),
			clip(this.y, minY, maxY, wrap))
	}

	set(x: number, y: number) {
		this.x = x
		this.y = y
	}

	isZero(){
		return this.x === 0 && this.y === 0
	}
}
