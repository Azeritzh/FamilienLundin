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
		if (this.x === 0 || this.y === 0)
			return this.x + this.y
		return Math.sqrt(this.lengthSquared())
	}

	isZero(){
		return this.x === 0 && this.y === 0 && this.z === 0
	}
}
