import { Minestryger } from "./minestryger"
import { FlagAction, MinestrygerAction, RevealAction, RevealAreaAction } from "./minestryger-action"
import { MinestrygerDisplay } from "./minestryger-display"
import { PlayState } from "./minestryger-state"

export class MinestrygerInput {
	private leftMouseDown = false
	private middleMouseDown = false
	private rightMouseDown = false
	private lastHoverPosition?: { x: number, y: number }
	public activateOnMouseDown = false

	constructor(
		public game: Minestryger,
		private display: MinestrygerDisplay,
		private onNewGame: () => void,
		private onAction: (action: MinestrygerAction) => void,
	) {
		this.setupEvents()
	}

	setupEvents() {
		this.display.canvas.onmousemove = this.mouseMove
		this.display.canvas.onmouseleave = this.mouseLeave
		this.display.canvas.onmousedown = x => this.updateMouseClick(x, true)
		this.display.canvas.onmouseup = x => this.updateMouseClick(x, false)
		this.display.canvas.oncontextmenu = x => x.preventDefault()
		this.display.textElements["button"].onclick = this.onNewGame
	}

	mouseMove = (event: MouseEvent) => {
		const { x, y } = this.gridPositionFromMousePosition(event)
		this.updateHovering(x, y)
	}

	mouseLeave = (event: MouseEvent) => {
		this.leftMouseDown = false
		this.middleMouseDown = false
		this.rightMouseDown = false
		this.mouseMove(event)
	}

	private updateHovering(x: number, y: number) {
		this.redrawLastHoverPosition()
		this.display.drawField(x, y, true)
		this.showMiddleClickHover(x, y)
		this.lastHoverPosition = { x, y }
	}

	private redrawLastHoverPosition() {
		if (!this.lastHoverPosition)
			return
		const { x, y } = this.lastHoverPosition
		this.display.drawField(x, y)
		for (const { i, j } of this.game.state.board.fieldsAround(x, y))
			this.display.drawField(i, j)
	}

	private showMiddleClickHover(x: number, y: number) {
		if (!this.shouldShowMiddleClickHover())
			return
		for (const { i, j, field } of this.game.state.board.fieldsAround(x, y))
			if (!field.locked && !field.revealed)
				this.display.drawField(i, j, true)
	}

	private shouldShowMiddleClickHover() {
		return (this.leftMouseDown && this.rightMouseDown) || this.middleMouseDown
	}

	updateMouseClick(event: MouseEvent, isDown: boolean) {
		event.preventDefault()
		if (this.hasFinished())
			return

		const { x, y } = this.gridPositionFromMousePosition(event)
		if (this.isLeftButton(event))
			this.handleLeftMouse(isDown, x, y)
		if (this.isMiddleButton(event))
			this.handleMiddleMouse(isDown, x, y)
		if (this.isRightButton(event))
			this.handleRightMouse(isDown, x, y)
		this.updateHovering(x, y)
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.display.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = Math.floor(mx / this.display.fieldSize)
		const y = Math.floor(my / this.display.fieldSize)
		return { x: x, y: y }
	}

	private hasFinished() {
		return this.game.state.playState === PlayState.Lost || this.game.state.playState === PlayState.Won
	}

	private isLeftButton(event: MouseEvent) {
		return event.button === 0
	}

	private isMiddleButton(event: MouseEvent) {
		return event.button === 1
	}

	private isRightButton(event: MouseEvent) {
		return event.button === 2
	}

	private handleLeftMouse(mouseDown: boolean, x: number, y: number) {
		this.leftMouseDown = mouseDown
		if (this.shouldClickField(this.leftMouseDown) && !this.rightMouseDown)
			this.revealField(x, y)
		if (!this.leftMouseDown && this.rightMouseDown)
			this.revealSurroundings(x, y)
	}

	private handleMiddleMouse(mouseDown: boolean, x: number, y: number) {
		this.middleMouseDown = mouseDown
		if (!this.middleMouseDown)
			this.revealSurroundings(x, y)
	}

	private handleRightMouse(mouseDown: boolean, x: number, y: number) {
		this.rightMouseDown = mouseDown
		if (this.shouldClickField(this.rightMouseDown) && !this.leftMouseDown)
			this.flagField(x, y)
		if (!this.rightMouseDown && this.leftMouseDown)
			this.revealSurroundings(x, y)
	}

	private shouldClickField(mouseDown: boolean) {
		return this.activateOnMouseDown === mouseDown
	}

	private revealField(x: number, y: number) {
		this.onAction(new RevealAction(x, y))
	}

	private flagField(x: number, y: number) {
		this.onAction(new FlagAction(x, y))
	}

	private revealSurroundings(x: number, y: number) {
		this.onAction(new RevealAreaAction(x, y))
	}
}
