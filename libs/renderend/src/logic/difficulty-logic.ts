import { GameLogic } from "@lundin/age"
import { RenderendConstants } from "../config/renderend-constants"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"

export class DifficultyLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
	) { }

	update() {
		if (!this.globals.isAlive)
			return
		this.globals.speed += this.constants.acceleration
	}
}
