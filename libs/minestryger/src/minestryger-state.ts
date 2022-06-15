import { GameGrid } from "@lundin/age"
import { MinestrygerConfig } from "./minestryger-config"

export class MinestrygerState {
	constructor(
		config: MinestrygerConfig,
		public playState: PlayState = PlayState.NotStarted,
		public startTime: number = null,
		public finishTime: number = null,
		public board = new GameGrid<Field>(config.width, config.height, () => new Field()),
		public hasUsedFlags = false,
		public tick = 0,
	) { }
}

export enum PlayState { NotStarted, Started, Won, Lost }

export class Field {
	bomb = false
	revealed = false
	surroundingBombs = 0
	locked = false
}
