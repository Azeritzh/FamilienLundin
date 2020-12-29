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
		const board = this.state.board
		const surroundingFields = [...board.fieldsAround(x, y)].map(x => x.field)
		for (const _ of range(0, this.config.bombs)) {
			let field = this.getRandomField()
			while (surroundingFields.includes(field) || field.bomb) // TODO: this risks an infinite loop
				field = this.getRandomField()
			field.bomb = true
		}
		for (const { x, y, field } of board.allFields()) {
			const nearby = [...board.fieldsAround(x, y)].map(x => x.field)
			const bombs = nearby.filter(x => x.bomb).length
			field.surroundingBombs = bombs
		}
	}

	private getRandomField() {
		const x = this.randomInteger(this.config.width)
		const y = this.randomInteger(this.config.height)
		return this.state.board.get(x, y)
	}

	private randomInteger(number: number) {
		return Math.floor(Math.random() * number)
	}
}