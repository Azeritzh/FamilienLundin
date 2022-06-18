import { Id, typeOf, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour } from "../state/entity-values"
import { Globals } from "../state/globals"
import { CollisionListener } from "./collision-logic"

export class DeathLogic implements CollisionListener {
	constructor(
		private typeBehaviours: Map<Id, Behaviour[]>,
		private globals: Globals,
		private setVelocity: ValueSetter<Vector2>,
	) { }

	onCollision(entity: Id) {
		if (!this.hasBehaviour(entity, Behaviour.DieOnCollision))
			return
		this.globals.speed = 0
		this.globals.isAlive = false
		this.setVelocity.setFor(entity, new Vector2(0, 0))
	}

	private hasBehaviour(entity: Id, behaviour: Behaviour) { // TODO: there should be a value accessor
		return this.typeBehaviours.get(typeOf(entity)).includes(behaviour)
	}
}
