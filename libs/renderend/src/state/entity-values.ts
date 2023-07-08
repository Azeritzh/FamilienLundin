import { BaseValues, Id, RectangularSize } from "@lundin/age"
import { Vector2 } from "@lundin/utility"

export class EntityValues extends BaseValues {
	constructor(
		public readonly bulletType = new Map<Id, Id>(),
		public readonly charge = new Map<Id, number>(),
		public readonly damage = new Map<Id, number>(),
		public readonly health = new Map<Id, number>(),
		public readonly orientation = new Map<Id, number>(),
		public readonly position = new Map<Id, Vector2>(),
		public readonly rectangularSize = new Map<Id, RectangularSize>(),
		public readonly velocity = new Map<Id, Vector2>(),
		public readonly shipBehaviour = new Map<Id, boolean>(),
		public readonly obstacleBehaviour = new Map<Id, boolean>(),
		public readonly dieOnCollisionBehaviour = new Map<Id, boolean>(),
		entities = new Map<Id, boolean>(),
	) {
		super(entities)
		this.Register(bulletType)
		this.Register(charge)
		this.Register(damage)
		this.Register(health)
		this.Register(orientation)
		this.Register(position)
		this.Register(rectangularSize)
		this.Register(velocity)
		this.Register(shipBehaviour)
		this.Register(obstacleBehaviour)
		this.Register(dieOnCollisionBehaviour)
	}

	public static from(groupedValues: Map<Id, GroupedEntityValues>) {
		const entityValues = new EntityValues()
		for (const [id, values] of groupedValues)
			entityValues.addValuesFrom(id, values)
		return entityValues
	}

	addValuesFrom(key: Id, values: GroupedEntityValues) {
		if (values.bulletType !== undefined)
			this.bulletType.set(key, values.bulletType)
		if (values.charge !== undefined)
			this.charge.set(key, values.charge)
		if (values.damage !== undefined)
			this.damage.set(key, values.damage)
		if (values.health !== undefined)
			this.health.set(key, values.health)
		if (values.orientation !== undefined)
			this.orientation.set(key, values.orientation)
		if (values.position !== undefined)
			this.position.set(key, values.position)
		if (values.rectangularSize !== undefined)
			this.rectangularSize.set(key, values.rectangularSize)
		if (values.velocity !== undefined)
			this.velocity.set(key, values.velocity)
		if (values.shipBehaviour !== undefined)
			this.shipBehaviour.set(key, values.shipBehaviour)
		if (values.obstacleBehaviour !== undefined)
			this.obstacleBehaviour.set(key, values.obstacleBehaviour)
		if (values.dieOnCollisionBehaviour !== undefined)
			this.dieOnCollisionBehaviour.set(key, values.dieOnCollisionBehaviour)
	}

	groupFor(key: Id): GroupedEntityValues {
		return {
			bulletType: this.bulletType.get(key),
			charge: this.charge.get(key),
			damage: this.damage.get(key),
			health: this.health.get(key),
			orientation: this.orientation.get(key),
			position: this.position.get(key),
			rectangularSize: this.rectangularSize.get(key),
			velocity: this.velocity.get(key),
			shipBehaviour: this.shipBehaviour.get(key),
			obstacleBehaviour: this.obstacleBehaviour.get(key),
			dieOnCollisionBehaviour: this.dieOnCollisionBehaviour.get(key),
		}
	}
}

// Remember to add class values to config mapping function in renderend-config.ts
export interface GroupedEntityValues {
	bulletType?: Id
	charge?: number
	damage?: number
	health?: number
	orientation?: number
	position?: Vector2
	rectangularSize?: RectangularSize
	velocity?: Vector2
	shipBehaviour?: boolean
	obstacleBehaviour?: boolean
	dieOnCollisionBehaviour?: boolean
}
