import { M3x3 } from "./m3x3"
import { Sprite } from "./sprite"
import { SpriteFactory } from "./sprite-factory"
import { StandardShader } from "./standard-shader"

export class WebGl2Display {
	constructor(
		public canvas: HTMLCanvasElement,
		private tileSize: number,
		private virtualScreenHeight: number,
		private gl = canvas.getContext("webgl2"),
		private standardShader = new StandardShader(gl),
		private previousProgram = null,
		private worldSpaceMatrix = buildWorldSpaceMatrix(canvas.width, canvas.height, virtualScreenHeight),
		private spriteFactory = new SpriteFactory(gl, standardShader, tileSize, worldSpaceMatrix),
		private sprites: { [index: string]: Sprite } = {},
		private loadingSprites: string[] = []
	) {
		this.gl.enable(this.gl.BLEND)
	}

	public startFrame() {
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
	}

	public drawSprite(name: string, x: number, y: number, frameX: number, frameY: number) {
		const sprite = this.sprites[name]
		if (!sprite)
			return console.warn("Could not load sprite {0}", name)
		if (this.previousProgram != sprite.shader.program) {
			this.gl.useProgram(sprite.shader.program)
			this.previousProgram = sprite.shader.program
		}
		sprite.render(x, y, frameX, frameY)
	}

	public endFrame() {
		this.previousProgram = null
		this.gl.useProgram(null)
		this.gl.flush()
	}

	// Do sprites need to be recreated after this?
	public resize(width: number, height: number) {
		this.canvas.width = width
		this.canvas.height = height
		this.worldSpaceMatrix = buildWorldSpaceMatrix(width, height, this.virtualScreenHeight)
		this.spriteFactory = new SpriteFactory(this.gl, this.standardShader, this.tileSize, this.worldSpaceMatrix)
	}

	public async addSprite(
		name: string,
		path: string,
		width = 16,
		height = 16,
		centerX = width / 2,
		centerY = height / 2,
	) {
		this.loadingSprites.push(name)
		this.sprites[name] = await this.spriteFactory.createSprite(path, width, height, centerX, centerY)
		this.loadingSprites.splice(this.loadingSprites.indexOf(name), 1)
	}

	public isLoading() {
		return this.loadingSprites.length > 0
	}
}

function buildWorldSpaceMatrix(width: number, height: number, virtualScreenHeight: number) {
	const widthRatio = width / (height / virtualScreenHeight)
	return new M3x3().transition(-1, 1).scale(2 / widthRatio, -2 / virtualScreenHeight)
}