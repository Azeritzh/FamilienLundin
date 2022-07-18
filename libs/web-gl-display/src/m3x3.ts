const M00 = 0
const M01 = 1
const M02 = 2
const M10 = 3
const M11 = 4
const M12 = 5
const M20 = 6
const M21 = 7
const M22 = 8

export class M3x3 {

	constructor(
		public matrix = new Float32Array([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		])
	) { }

	multiply(m: M3x3) {
		const output = new M3x3()
		output.matrix = new Float32Array([
			this.matrix[M00] * m.matrix[M00] + this.matrix[M10] * m.matrix[M01] + this.matrix[M20] * m.matrix[M02],
			this.matrix[M01] * m.matrix[M00] + this.matrix[M11] * m.matrix[M01] + this.matrix[M21] * m.matrix[M02],
			this.matrix[M02] * m.matrix[M00] + this.matrix[M12] * m.matrix[M01] + this.matrix[M22] * m.matrix[M02],

			this.matrix[M00] * m.matrix[M10] + this.matrix[M10] * m.matrix[M11] + this.matrix[M20] * m.matrix[M12],
			this.matrix[M01] * m.matrix[M10] + this.matrix[M11] * m.matrix[M11] + this.matrix[M21] * m.matrix[M12],
			this.matrix[M02] * m.matrix[M10] + this.matrix[M12] * m.matrix[M11] + this.matrix[M22] * m.matrix[M12],

			this.matrix[M00] * m.matrix[M20] + this.matrix[M10] * m.matrix[M21] + this.matrix[M20] * m.matrix[M22],
			this.matrix[M01] * m.matrix[M20] + this.matrix[M11] * m.matrix[M21] + this.matrix[M21] * m.matrix[M22],
			this.matrix[M02] * m.matrix[M20] + this.matrix[M12] * m.matrix[M21] + this.matrix[M22] * m.matrix[M22]
		])
		return output
	}

	transition(x: number, y: number) {
		const output = new M3x3()
		output.matrix = new Float32Array([
			this.matrix[M00],
			this.matrix[M01],
			this.matrix[M02],

			this.matrix[M10],
			this.matrix[M11],
			this.matrix[M12],

			x * this.matrix[M00] + y * this.matrix[M10] + this.matrix[M20],
			x * this.matrix[M01] + y * this.matrix[M11] + this.matrix[M21],
			x * this.matrix[M02] + y * this.matrix[M12] + this.matrix[M22]
		])
		return output
	}

	scale(x: number, y: number) {
		const output = new M3x3()
		output.matrix = new Float32Array([
			this.matrix[M00] * x,
			this.matrix[M01] * x,
			this.matrix[M02] * x,

			this.matrix[M10] * y,
			this.matrix[M11] * y,
			this.matrix[M12] * y,

			this.matrix[M20],
			this.matrix[M21],
			this.matrix[M22]
		])
		return output
	}

	static transformation(translateX: number, translateY: number, rotation: number, scaleX: number, scaleY: number) {
		const output = new M3x3()
		const sin = Math.sin(rotation)
		const cos = Math.cos(rotation)
		output.matrix = new Float32Array([
			cos * scaleX,
			-sin * scaleY,
			0,

			sin * scaleX,
			cos * scaleY,
			0,

			translateX,
			translateY,
			1
		])
		return output
	}

	setToTransformation(translateX: number, translateY: number, rotation: number, scaleX: number, scaleY: number) {
		const sin = Math.sin(rotation)
		const cos = Math.cos(rotation)

		this.matrix[M00] = cos * scaleX
		this.matrix[M01] = -sin * scaleY
		this.matrix[M02] = 0

		this.matrix[M10] = sin * scaleX
		this.matrix[M11] = cos * scaleY
		this.matrix[M12] = 0

		this.matrix[M20] = translateX
		this.matrix[M21] = translateY
		this.matrix[M22] = 1

		return this
	}

	getFloatArray() {
		return this.matrix
	}
}
