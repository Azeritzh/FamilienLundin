import { GameGrid, GameState } from "@lundin/age"
import { MinestrygerConfig } from "./minestryger-config"

export class MinestrygerState implements GameState {

	constructor(
		config: MinestrygerConfig,
		public playState: PlayState = PlayState.NotStarted,
		public board = new GameGrid<Field>(config.width, config.height, () => new Field()),
		public tick = 0,
	) { }
}

export enum PlayState { NotStarted, Started, Won, Lost }

class Field {
	bomb = false
	revealed = false
	surroundingBombs = 0
	locked = false
}
