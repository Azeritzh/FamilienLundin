import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendAction, ShootBulletAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class BulletLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private charge: ValueGetter<number>,
		private position: ValueGetter<Vector2>,
		private setCharge: ValueSetter<number>,
		private setPosition: ValueSetter<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		if (!actions.some(x => x instanceof ShootBulletAction))
			return
		for (const [entity, bulletType] of this.entities.with.bulletType)
			this.spawnBulletFor(entity, bulletType)
	}

	private spawnBulletFor(entity: Id, bulletType: Id) {
		const charge = this.charge.currentlyOf(entity)
		if (charge < 1)
			return
		const position = this.position.of(entity) ?? new Vector2(0, 0)
		const bullet = this.entities.create(bulletType)
		this.setPosition.for(bullet, position.add(new Vector2(1, 0)))
		if (charge > 0)
			this.setCharge.for(entity, charge - 1)
	}
}
