import { Id, ValueGetter } from "@lundin/age"
import { Globals } from "../state/globals"
import { DeathListener } from "./death-logic"

export class GameOverLogic implements DeathListener {
	constructor(
		private globals: Globals,
		private shipBehaviour: ValueGetter<boolean>,
	) { }

	onDeath(entity: Id) {
		if (!this.shipBehaviour.Of(entity))
			return
		this.globals.speed = 0
		this.globals.isAlive = false
	}
}
