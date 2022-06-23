import { GameLogic } from "@lundin/age"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"

export class DifficultyLogic implements GameLogic<RenderendAction> {
	constructor(
		private globals: Globals,
	) { }

	update() {
		if (!this.globals.isAlive)
			return
		this.globals.speed += 0.0001
	}
}
