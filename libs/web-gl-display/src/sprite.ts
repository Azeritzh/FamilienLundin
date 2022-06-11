import { M3x3 } from "./m3x3"
import { StandardShader } from "./standard-shader"

export class Sprite {
	constructor(
		public gl: WebGL2RenderingContext,
		public shader: StandardShader,
		private tileSize: number,
		private worldSpaceMatrix: M3x3,
		private texture: WebGLTexture,
		private textureBuffer: WebGLBuffer,
		private geometryBuffer: WebGLBuffer,
		private uvX: number,
		private uvY: number,
	) {
	}

	render(x: number, y: number, frameX = 0, frameY = 0) {
		const gl = this.gl

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform1i(this.shader.uImageLocation, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer)
		gl.enableVertexAttribArray(this.shader.aTexCoordLocation)
		gl.vertexAttribPointer(this.shader.aTexCoordLocation, 2, gl.FLOAT, false, 0, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.geometryBuffer)
		gl.enableVertexAttribArray(this.shader.aPositionLocation)
		gl.vertexAttribPointer(this.shader.aPositionLocation, 2, gl.FLOAT, false, 0, 0)

		const fX = frameX * this.uvX
		const fY = frameY * this.uvY
		const trans = new M3x3().transition(x * this.tileSize, y * this.tileSize)

		gl.uniform2f(this.shader.uFrameLocation, fX, fY)
		gl.uniformMatrix3fv(this.shader.uWorldLocation, false, this.worldSpaceMatrix.getFloatArray())
		gl.uniformMatrix3fv(this.shader.uObjectLocation, false, trans.getFloatArray())

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
	}
}
