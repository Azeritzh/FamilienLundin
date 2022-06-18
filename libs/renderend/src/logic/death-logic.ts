import { Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Globals } from "../state/globals"
import { CollisionListener } from "./collision-logic"

export class DeathLogic implements CollisionListener {
	constructor(
		private globals: Globals,
		private dieOnCollisionBehaviour: ValueGetter<boolean>,
		private setVelocity: ValueSetter<Vector2>,
	) { }

	onCollision(entity: Id) {
		if (!this.dieOnCollisionBehaviour.of(entity))
			return
		this.globals.speed = 0
		this.globals.isAlive = false
		this.setVelocity.for(entity, new Vector2(0, 0))
	}
}
