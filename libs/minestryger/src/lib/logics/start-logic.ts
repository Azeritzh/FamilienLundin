import { GameLogic } from "@lundin/age"
import { range } from "@lundin/utility"
import { MinestrygerAction, RevealAction } from "../minestryger-action"
import { MinestrygerConfig } from "../minestryger-config"
import { MinestrygerState, PlayState } from "../minestryger-state"

export class StartLogic implements GameLogic<MinestrygerAction> {
	constructor(
		private config: MinestrygerConfig,
		private state: MinestrygerState,
	) { }

	update(actions: MinestrygerAction[]) {
		if (this.state.playState !== PlayState.NotStarted)
			return
		for (const action of actions)
			if (this.isFirstReveal(action))
				this.initialiseGame(action.x, action.y)
	}

	private isFirstReveal(action: MinestrygerAction): action is RevealAction {
		return this.state.playState === PlayState.NotStarted && action instanceof RevealAction
	}

	private initialiseGame(x: number, y: number) {
		this.state.playState = PlayState.Started
		this.state.startTime = Date.now()
		this.generateAround(x, y)
	}

	generateAround(x: number, y: number) {
		const bombableFields = this.getBombableFields(x, y)
		for (const _ of range(0, this.config.bombs))
			this.takeRandomFrom(bombableFields).bomb = true
		this.updateBombCounts()
	}

	private getBombableFields(startX: number, startY: number) {
		const startField = this.state.board.get(startX, startY)
		const surroundingFields = [...this.state.board.fieldsAround(startX, startY)].map(x => x.field)
		const bombableFields = [...this.state.board.allFields()].map(x => x.field)

		this.removeFrom(bombableFields, x => x === startField)
		if (this.shouldStartWithEmptyArea())
			for (const field of surroundingFields)
				this.removeFrom(bombableFields, x => x === field)
		return bombableFields
	}

	private shouldStartWithEmptyArea() {
		const bombFactor = this.config.bombs / (this.config.width * this.config.height)
		return bombFactor < 0.5
	}

	private removeFrom<T>(list: T[], predicate: (entry: T) => boolean) {
		const index = list.findIndex(predicate)
		list.splice(index, 1)
	}

	private takeRandomFrom<T>(list: T[]) {
		return list.splice(this.randomInteger(list.length), 1)[0]
	}

	private randomInteger(number: number) {
		return Math.floor(Math.random() * number)
	}

	private updateBombCounts() {
		for (const { x, y, field } of this.state.board.allFields()) {
			const nearby = [...this.state.board.fieldsAround(x, y)].map(x => x.field)
			const bombs = nearby.filter(x => x.bomb).length
			field.surroundingBombs = bombs
		}
	}
}