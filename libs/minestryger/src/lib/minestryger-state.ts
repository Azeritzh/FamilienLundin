import { GameGrid, GameState } from "@lundin/age"

export class MinestrygerState implements GameState {
    tick: number = 0
    board = new GameGrid<Field>(10, 10, () => {
        return new Field()
    })
}

class Field {
    bomb = false
    revealed = false
    surroundingBombs = 0
    locked = false
}
