import { AgEngine, GameState } from "@lundin/age"

export class NoughtsAndCrosses {
	private engine: AgEngine<NoughtsAndCrossesAction>
	constructor() {
		this.engine = new AgEngine([], new NoughtsAndCrossesState())
	}

	update(...actions: NoughtsAndCrossesAction[]) {
		this.engine.update(actions)
	}
}

export class NoughtsAndCrossesState implements GameState {
	constructor(
		public board: NoughtsAndCrossesType[] = null,
		public tick: number = 0,
	) {
		if (!board)
			this.initialiseBoard()
	}

	private initialiseBoard() {
		this.board = []
		for (let i = 0; i < 9; i++)
			this.board.push(NoughtsAndCrossesType.None)
	}
}

export enum NoughtsAndCrossesType { None, Nought, Cross }

export class NoughtsAndCrossesAction { }
