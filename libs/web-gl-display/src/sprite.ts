import { M3x3 } from "./m3x3"
import { StandardShader } from "./standard-shader"
import { Vector3 } from "@lundin/utility"

export class Sprite {
	constructor(
		public gl: WebGL2RenderingContext,
		public shader: StandardShader,
		private tileSize: number,
		private worldSpaceMatrix: M3x3,
		private texture: WebGLTexture,
		private textureBuffer: WebGLBuffer,
		private geometryBuffer: WebGLBuffer,
		private centerX: number,
		private centerY: number,
		private offsetX: number,
		private offsetY: number,
		private uvX: number,
		private uvY: number,
		private color = new Float32Array([1, 1, 1, 1]),
		private transformation = new M3x3(),
	) {
	}

	render(x: number, y: number, frameX = 0, frameY = 0, rotation = 0, color: Vector3 = null, alpha = 1, scaleX = 1, scaleY = 1) {
		const gl = this.gl

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform1i(this.shader.uImageLocation, 0)

		this.color[0] = color?.x ?? 1
		this.color[1] = color?.y ?? 1
		this.color[2] = color?.z ?? 1
		this.color[3] = alpha
		gl.uniform4fv(this.shader.uColorLocation, this.color)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer)
		gl.enableVertexAttribArray(this.shader.aTexCoordLocation)
		gl.vertexAttribPointer(this.shader.aTexCoordLocation, 2, gl.FLOAT, false, 0, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.geometryBuffer)
		gl.enableVertexAttribArray(this.shader.aPositionLocation)
		gl.vertexAttribPointer(this.shader.aPositionLocation, 2, gl.FLOAT, false, 0, 0)

		const fX = frameX * this.uvX + this.offsetX
		const fY = frameY * this.uvY + this.offsetY

		this.transformation.reset()
		this.transformation.transformFrom(x * this.tileSize, y * this.tileSize, -rotation, scaleX, scaleY)
		this.transformation.transformFrom(- this.centerX, - this.centerY, 0, 1, 1)

		gl.uniform2f(this.shader.uFrameLocation, fX, fY)
		gl.uniformMatrix3fv(this.shader.uWorldLocation, false, this.worldSpaceMatrix.getFloatArray())
		gl.uniformMatrix3fv(this.shader.uObjectLocation, false, this.transformation.getFloatArray())

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
	}
}
