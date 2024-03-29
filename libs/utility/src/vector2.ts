import { Contain, clip } from "./utility"

export class Vector2 {
	constructor(
		public x: number,
		public y: number,
	) { }

	get X() { return this.x }
	set X(value: number) { this.x = value }
	get Y() { return this.y }
	set Y(value: number) { this.y = value }

	static fromAngle(angle: number) {
		return new Vector2(1, 0).rotate(angle) // TODO: double check that this is correct
	}

	add(vector: Vector2) {
		return new Vector2(this.x + vector.x, this.y + vector.y)
	}

	addFrom(vector: Vector2) {
		return this.set(this.x + vector.x, this.y + vector.y)
	}

	addFromNumbers(x: number, y: number) {
		return this.set(this.x + x, this.y + y)
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

	rotateFrom(angle: number) {
		return this.set(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle))
	}

	getAngle() {
		const angle = Math.atan2(this.y, this.x)
		return angle < 0 ? angle + Math.PI * 2 : angle
	}

	angle() {
		return Math.atan2(this.y, this.x)
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y
	}

	LengthSquared = this.lengthSquared

	unitVector() {
		const length = this.length()
		if (length === 0)
			return new Vector2(0, 0)
		return new Vector2(this.x / length, this.y / length)
	}

	length() {
		if (this.x === 0 || this.y === 0)
			return Math.abs(this.x) + Math.abs(this.y)
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
		return this
	}

	withX(x: number) {
		return new Vector2(x, this.y)
	}

	withY(y: number) {
		return new Vector2(this.x, y)
	}

	isZero() {
		return this.x === 0 && this.y === 0
	}

	Contain(position: Vector2){
		return new Vector2(
			Contain(position.X, 0, this.X),
			Contain(position.Y, 0, this.Y),
		)
	}

	static Zero = new Vector2(0, 0)
}

Vector2.Zero.set = () => { throw new Error("Can't override zero vector") }
