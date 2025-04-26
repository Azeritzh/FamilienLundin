import { M3x3 } from "./m3x3"
import { Sprite } from "./sprite"
import { SpriteFactory } from "./sprite-factory"
import { StandardShader } from "./standard-shader"
import { Vector3 } from "@lundin/utility"

export class WebGl2Display {
	constructor(
		public canvas: HTMLCanvasElement,
		private tileSize: number,
		private virtualScreenHeight: number,
		private alignToPixelGrid = false,
		private gl = canvas.getContext("webgl2")!,
		private standardShader = new StandardShader(gl),
		private previousProgram: WebGLProgram | null = null,
		private worldSpaceMatrix = buildWorldSpaceMatrix(canvas.width, canvas.height, virtualScreenHeight),
		private spriteFactory = new SpriteFactory(gl, standardShader, tileSize, worldSpaceMatrix),
		private sprites: { [index: string]: Sprite } = {},
		private loadingSprites: string[] = [],
		public sortByDepth = false,
		private sortedSprites = new SortedSprites(),
	) {
		this.gl.enable(this.gl.BLEND)
	}

	public startFrame() {
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
	}

	public draw(sprite: string, x: number, y: number, frameX: number, frameY: number, depth = 1, rotation = 0, color: Vector3 | null = null, alpha = 1) {
		if (this.sortByDepth)
			this.sortedSprites.add(sprite, x, y, frameX, frameY, depth, rotation, color, alpha)
		else
			this.drawSprite(sprite, x, y, frameX, frameY, rotation, color, alpha)
	}

	public endFrame() {
		if (this.sortByDepth) {
			this.sortedSprites.sort()
			for (let i = 0; i < this.sortedSprites.numberOfSprites; i++) {
				const sprite = this.sortedSprites.spritesToDraw[i]
				this.drawSprite(sprite.sprite, sprite.x, sprite.y, sprite.frameX, sprite.frameY, sprite.rotation, sprite.color, sprite.alpha)
			}
			this.sortedSprites.reset()
		}
		this.previousProgram = null
		this.gl.useProgram(null)
		this.gl.flush()
	}

	private drawSprite(name: string, x: number, y: number, frameX: number, frameY: number, rotation = 0, color: Vector3 | null = null, alpha = 1) {
		const sprite = this.sprites[name]
		if (!sprite)
			return console.warn("Could not load sprite {0}", name)
		if (this.previousProgram != sprite.shader.program) {
			this.gl.useProgram(sprite.shader.program)
			this.previousProgram = sprite.shader.program
		}
		if (this.alignToPixelGrid) {
			x = Math.floor(x * this.tileSize) / this.tileSize
			y = Math.floor(y * this.tileSize) / this.tileSize
		}
		sprite.render(x, y, frameX, frameY, rotation, color, alpha)
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
		centerX = 0,
		centerY = 0,
		offsetX = 0,
		offsetY = 0,
	) {
		this.loadingSprites.push(name)
		this.sprites[name] = await this.spriteFactory.createSprite(path, width, height, centerX, centerY, offsetX, offsetY)
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

class SortedSprites {
	constructor(
		public spritesToDraw: SpriteDrawInfo[] = [],
		public numberOfSprites = 0,
	) { }

	reset() {
		this.numberOfSprites = 0
	}

	sort() {
		for (let i = this.numberOfSprites; i < this.spritesToDraw.length; i++)
			this.spritesToDraw[i].disabled = true
		this.spritesToDraw.sort((a, b) => {
			if (a.disabled)
				return 1
			if (b.disabled)
				return -1
			return a.depth - b.depth
		})
	}

	add(
		sprite: string,
		x: number,
		y: number,
		frameX: number,
		frameY: number,
		depth: number,
		rotation = 0,
		color: Vector3 | null = null,
		alpha = 1,
	) {
		if (!this.spritesToDraw[this.numberOfSprites]) {
			this.spritesToDraw[this.numberOfSprites] = new SpriteDrawInfo(false, sprite, x, y, frameX, frameY, depth, rotation, color, alpha)
			this.numberOfSprites++
			return
		}
		const info = this.spritesToDraw[this.numberOfSprites]
		info.disabled = false
		info.sprite = sprite
		info.x = x
		info.y = y
		info.frameX = frameX
		info.frameY = frameY
		info.depth = depth
		info.rotation = rotation
		info.color = color
		info.alpha = alpha
		this.numberOfSprites++
	}
}

class SpriteDrawInfo {
	constructor(
		public disabled: boolean,
		public sprite: string,
		public x: number,
		public y: number,
		public frameX: number,
		public frameY: number,
		public depth: number,
		public rotation = 0,
		public color: Vector3 | null = null,
		public alpha = 1,
	) { }
}
