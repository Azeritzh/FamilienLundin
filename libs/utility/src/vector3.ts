export class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) { }

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

	getAngle( ) {
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

	withX(x: number) {
		return new Vector3(x, this.y, this.z)
	}

	withY(y: number) {
		return new Vector3(this.x, y, this.z)
	}

	withZ(z: number) {
		return new Vector3(this.x, this.y, z)
	}
}
