import { GameGrid, GameState } from "@lundin/age"
import { range } from "@lundin/utility"
import { MinestrygerConfig } from "./minestryger-config"

export class MinestrygerState implements GameState {

	constructor(
		private config: MinestrygerConfig,
		public board = new GameGrid<Field>(config.width, config.height, () => new Field()),
		public tick = 0,
	) { }

	generateAround(x: number, y: number) {
		const surroundingFields = [...this.board.fieldsAround(x, y)].map(x => x.field)
		for (const i of range(0, this.config.bombs)) {
			let field = this.getRandomField()
			while (surroundingFields.includes(field)) // TODO: this risks an infinite loop
				field = this.getRandomField()
			field.bomb = true
		}
		for (const { x, y, field } of this.board.allFields()) {
			const nearby = [...this.board.fieldsAround(x, y)].map(x => x.field)
			const bombs = nearby.filter(x => x.bomb).length
			field.surroundingBombs = bombs
		}
	}

	private getRandomField() {
		const x = this.randomInteger(this.config.width)
		const y = this.randomInteger(this.config.height)
		return this.board.get(x, y)
	}

	private randomInteger(number: number) {
		return Math.floor(Math.random() * number)
	}
}

class Field {
	bomb = false
	revealed = false
	surroundingBombs = 0
	locked = false
}
