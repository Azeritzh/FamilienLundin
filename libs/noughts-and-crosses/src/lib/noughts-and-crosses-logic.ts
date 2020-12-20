import { GameLogic, GameState } from "@lundin/age"
import { NoughtsAndCrossesState } from "./noughts-and-crosses-state"

export class NoughtsAndCrossesLogic implements GameLogic<NoughtsAndCrossesAction> {
	constructor(private readonly state: NoughtsAndCrossesState) { }
	
	update(actions: NoughtsAndCrossesAction[]): void {
		throw new Error("Method not implemented.")
	}
}

export class NoughtsAndCrossesAction { }
