export type GridVector = Vector3

export class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) { }

	get X() { return this.x }
	set X(value: number) { this.x = value }
	get Y() { return this.y }
	set Y(value: number) { this.y = value }
	get Z() { return this.z }
	set Z(value: number) { this.z = value }

	add(vector: Vector3) {
		return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z)
	}

	subtract(vector: Vector3) {
		return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z)
	}

	multiply(factor: number) {
		return new Vector3(this.x * factor, this.y * factor, this.z * factor)
	}

	rotate(angle: number) {
		return new Vector3(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle),
			0)
	}

	getAngle() {
		const angle = Math.atan2(this.y, this.x)
		return angle < 0 ? angle + Math.PI * 2 : angle
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}

	unitVector() {
		const length = this.length()
		if (length === 0)
			return new Vector3(0, 0, 0)
		return new Vector3(this.x / length, this.y / length, this.z / length)
	}

	length() {
		return Math.sqrt(this.lengthSquared())
	}

	isZero() {
		return this.x === 0 && this.y === 0 && this.z === 0
	}

	equals(vector: Vector3) {
		return this.x === vector.x && this.y === vector.y && this.z === vector.z
	}

	static copy(vector: Vector3) {
		return new Vector3(vector.x, vector.y, vector.z)
	}

	stringify() {
		return this.x + "," + this.y + "," + this.z
	}

	static parse(text: string) {
		const [x, y, z] = text.split(",")
		return new Vector3(+x, +y, +z)
	}

	static stringify(x: number, y: number, z: number) {
		return x + "," + y + "," + z
	}

	static From(object: any) {
		return Object.assign(new Vector3(0, 0, 0), object)
	}

	withX(x: number) {
		return new Vector3(x, this.y, this.z)
	}

	withY(y: number) {
		return new Vector3(this.x, y, this.z)
	}

	withZ(z: number) {
		return new Vector3(this.x, this.y, z)
	}

	set(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	setFrom(vector: Vector3) {
		this.set(vector.x, vector.y, vector.z)
		return this
	}

	/** Add the given vector in-place */
	addFrom(vector: Vector3) {
		return this.set(this.x + vector.x, this.y + vector.y, this.z + vector.z)
	}

	/** Subtract in-place. THIS IS NOT THE INVERSE OF SUBTRACT */
	subtractFrom(vector: Vector3) {
		return this.set(this.x - vector.x, this.y - vector.y, this.z - vector.z)
	}

	/** Multiply in-place */
	multiplyFrom(factor: number) {
		return this.set(this.x * factor, this.y * factor, this.z * factor)
	}

	/** Rotate in-place */
	rotateFrom(angle: number) {
		return this.set(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle),
			0)
	}

	static Zero = new Vector3(0, 0, 0)
}
