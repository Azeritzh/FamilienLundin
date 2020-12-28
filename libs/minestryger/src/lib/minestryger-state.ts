import { GameGrid, GameState } from "@lundin/age"

export class MinestrygerState implements GameState {
	tick = 0
	board = new GameGrid<Field>(30, 16, () => {
		return new Field()
	})
}

class Field {
	bomb = false
	revealed = false
	surroundingBombs = 0
	locked = false
}
