import { Id, ValueGetter, ValueSetter } from "@lundin/age"
import { CollisionListener } from "./collision-logic"

export class DamageLogic implements CollisionListener {
	constructor(
		private damage: ValueGetter<number>,
		private health: ValueGetter<number>,
		private setHealth: ValueSetter<number>,
	) { }

	onCollision(entity: Id, otherEntity: Id) {
		const damage = this.damage.Of(entity) ?? 0
		if (damage === 0)
			return
		const health = this.health.Of(otherEntity) ?? null
		if (health === null || health < 0)
			return
		this.setHealth.For(otherEntity, health - damage)
	}
}
