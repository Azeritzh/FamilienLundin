export class GenericShader {
	program: WebGLProgram

	constructor(
		private gl: WebGL2RenderingContext,
		vertexShaderScript: string,
		fragmentShaderScript: string,
	) {
		const vertexShader = this.getShader(vertexShaderScript, gl.VERTEX_SHADER)!
		const fragmentShader = this.getShader(fragmentShaderScript, gl.FRAGMENT_SHADER)!
		this.program = this.createProgram(vertexShader, fragmentShader)
		gl.deleteShader(vertexShader)
		gl.deleteShader(fragmentShader)
	}

	getShader(script: string, type: number) {
		const shader = this.gl.createShader(type)!
		this.gl.shaderSource(shader, script)
		this.gl.compileShader(shader)

		const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
		if (!success)
			throw new Error("Shader error: " + this.gl.getShaderInfoLog(shader))
		return shader
	}

	createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
		const program = this.gl.createProgram()
		this.gl.attachShader(program, vertexShader)
		this.gl.attachShader(program, fragmentShader)
		this.gl.linkProgram(program)

		const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
		if (!success)
			throw new Error("Shader program error: " + this.gl.getProgramInfoLog(program))

		this.gl.detachShader(program, vertexShader)
		this.gl.detachShader(program, fragmentShader)
		this.gl.useProgram(null)
		return program
	}
}
