import { Id, typeOf } from "@lundin/age"
import { Renderend } from "@lundin/renderend"
import { WebGl2Display } from "@lundin/web-gl-display"

export class RenderendDisplay {
	private display: WebGl2Display
	private stop = false

	constructor(
		private game: Renderend,
		private canvas: HTMLCanvasElement,
	) {
		this.setupDisplay()
	}

	onDestroy() {
		this.stop = true
	}

	startDisplayLoop() {
		requestAnimationFrame(this.drawEverything)
	}

	private setupDisplay() {
		this.display = new WebGl2Display(this.canvas, 16, 160)
		this.display.addSprite("ship", "assets/images/renderend/ship.png", 16, 16)
		this.display.addSprite("obstacle", "assets/images/renderend/obstacle.png", 16, 16)
		this.display.addSprite("background", "assets/images/renderend/starry-background.png", 220, 160)
	}

	setSize(width: number, height: number) {
		this.canvas.width = width
		this.canvas.height = height
		this.setupDisplay()
	}

	private drawEverything = () => {
		this.display.startFrame()
		this.drawBackground()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
		if (!this.stop)
			requestAnimationFrame(this.drawEverything)
	}

	private drawBackground() {
		const backgroundWidth = 220 / 16
		const speedFactor = 0.5
		const offset = (-this.game.state.globals.distanceTravelled * speedFactor) % backgroundWidth
		this.display.drawSprite("background", offset, 0, 0, 0)
		this.display.drawSprite("background", offset + backgroundWidth, 0, 0, 0)
		this.display.drawSprite("background", offset + backgroundWidth * 2, 0, 0, 0)
	}

	private drawEntity(entity: Id) {
		const pos = this.game.access.position.of(entity)
		const sprite = typeOf(entity) == this.game.config.constants.shipType
			? "ship"
			: "obstacle"
		// These are how the sprite should be offset in comparison to the entity's center point
		// It's just hardcoded for now, so sprites of size 1x1 will center on the entity's center point
		const offsetX = -0.5
		const offsetY = -0.5
		this.display.drawSprite(sprite, pos.x + offsetX, pos.y + offsetY, 0, 0)
	}
}
