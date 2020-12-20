import { GameState } from "@lundin/age"

export class VirusState implements GameState {
	constructor(
		public tick: number = 0,
	) { }

	findWinner() {
		return null
	}
}
