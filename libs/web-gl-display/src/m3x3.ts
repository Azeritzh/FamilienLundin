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
		public matrix = [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]
	) { }

	multiply(m: M3x3) {
		const output = new M3x3()
		output.matrix = [
			this.matrix[M00] * m.matrix[M00] + this.matrix[M10] * m.matrix[M01] + this.matrix[M20] * m.matrix[M02],
			this.matrix[M01] * m.matrix[M00] + this.matrix[M11] * m.matrix[M01] + this.matrix[M21] * m.matrix[M02],
			this.matrix[M02] * m.matrix[M00] + this.matrix[M12] * m.matrix[M01] + this.matrix[M22] * m.matrix[M02],

			this.matrix[M00] * m.matrix[M10] + this.matrix[M10] * m.matrix[M11] + this.matrix[M20] * m.matrix[M12],
			this.matrix[M01] * m.matrix[M10] + this.matrix[M11] * m.matrix[M11] + this.matrix[M21] * m.matrix[M12],
			this.matrix[M02] * m.matrix[M10] + this.matrix[M12] * m.matrix[M11] + this.matrix[M22] * m.matrix[M12],

			this.matrix[M00] * m.matrix[M20] + this.matrix[M10] * m.matrix[M21] + this.matrix[M20] * m.matrix[M22],
			this.matrix[M01] * m.matrix[M20] + this.matrix[M11] * m.matrix[M21] + this.matrix[M21] * m.matrix[M22],
			this.matrix[M02] * m.matrix[M20] + this.matrix[M12] * m.matrix[M21] + this.matrix[M22] * m.matrix[M22]
		]
		return output
	}

	transition(x: number, y: number) {
		const output = new M3x3()
		output.matrix = [
			this.matrix[M00],
			this.matrix[M01],
			this.matrix[M02],

			this.matrix[M10],
			this.matrix[M11],
			this.matrix[M12],

			x * this.matrix[M00] + y * this.matrix[M10] + this.matrix[M20],
			x * this.matrix[M01] + y * this.matrix[M11] + this.matrix[M21],
			x * this.matrix[M02] + y * this.matrix[M12] + this.matrix[M22]
		]
		return output
	}

	scale(x: number, y: number) {
		const output = new M3x3()
		output.matrix = [
			this.matrix[M00] * x,
			this.matrix[M01] * x,
			this.matrix[M02] * x,

			this.matrix[M10] * y,
			this.matrix[M11] * y,
			this.matrix[M12] * y,

			this.matrix[M20],
			this.matrix[M21],
			this.matrix[M22]
		]
		return output
	}

	getFloatArray() {
		return new Float32Array(this.matrix)
	}
}
