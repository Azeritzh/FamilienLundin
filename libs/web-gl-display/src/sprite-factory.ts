import { M3x3 } from "./m3x3"
import { Sprite } from "./sprite"
import { StandardShader } from "./standard-shader"

export class SpriteFactory {
	constructor(
		public gl: WebGL2RenderingContext,
		public shader: StandardShader,
		private tileSize: number,
		private worldSpaceMatrix: M3x3,
	) { }

	async createSprite(
		path: string,
		width: number,
		height: number,
		centerX: number,
		centerY: number,
		offsetX: number,
		offsetY: number,
	) {
		const image = await this.loadImage(path)

		const uvX = width / image.width
		const uvY = height / image.height

		this.gl.useProgram(this.shader.program)
		const texture = this.createTexture(image)
		const textureBuffer = this.createTextureBuffer(uvX, uvY)
		const geometryBuffer = this.createGeometryBuffer(width, height)
		this.gl.useProgram(null)

		return new Sprite(
			this.gl,
			this.shader,
			this.tileSize,
			this.worldSpaceMatrix,
			texture,
			textureBuffer,
			geometryBuffer,
			centerX,
			centerY,
			offsetX / image.width,
			offsetY / image.height,
			uvX,
			uvY,
		)
	}

	private loadImage(url: string) {
		return new Promise<HTMLImageElement>((resolve) => {
			const image = new Image()
			image.onload = () =>
				resolve(image)
			image.src = url
		})
	}

	private createTexture(image: HTMLImageElement) {
		const gl = this.gl
		const texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			gl.MIRRORED_REPEAT)
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			gl.MIRRORED_REPEAT)
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.NEAREST)
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			gl.NEAREST)
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			image)
		gl.bindTexture(gl.TEXTURE_2D, null)
		return texture
	}

	private createTextureBuffer(uvX: number, uvY: number) {
		const gl = this.gl
		const textureBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, this.createRectArray(0, 0, uvX, uvY), gl.STATIC_DRAW)
		return textureBuffer
	}

	private createGeometryBuffer(width: number, height: number) {
		const gl = this.gl
		const geometryBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, geometryBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, this.createRectArray(0, 0, width, height), gl.STATIC_DRAW)
		return geometryBuffer
	}

	private createRectArray(x = 0, y = 0, w = 1, h = 1) {
		return new Float32Array([
			x, y,
			x + w, y,
			x, y + h,
			x, y + h,
			x + w, y,
			x + w, y + h
		])
	}
}
