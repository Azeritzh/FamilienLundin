import { BaseValues, Id, RectangularSize } from "@lundin/age"
import { Vector2 } from "@lundin/utility"

export class EntityValues extends BaseValues {
	constructor(
		public readonly rectangularSize = new Map<Id, RectangularSize>(),
		public readonly health = new Map<Id, number>(),
		public readonly orientation = new Map<Id, number>(),
		public readonly position = new Map<Id, Vector2>(),
		public readonly velocity = new Map<Id, Vector2>(),
		public readonly shipBehaviour = new Map<Id, boolean>(),
		public readonly obstacleBehaviour = new Map<Id, boolean>(),
		public readonly dieOnCollisionBehaviour = new Map<Id, boolean>(),
		entities = new Map<Id, boolean>(),
	) {
		super(entities)
		this.register(rectangularSize)
		this.register(health)
		this.register(orientation)
		this.register(position)
		this.register(velocity)
		this.register(shipBehaviour)
		this.register(obstacleBehaviour)
		this.register(dieOnCollisionBehaviour)
	}

	public static from(groupedValues: Map<Id, GroupedEntityValues>) {
		const entityValues = new EntityValues()
		for (const [id, values] of groupedValues)
			entityValues.addValuesFrom(id, values)
		return entityValues
	}

	addValuesFrom(key: Id, values: GroupedEntityValues) {
		if (values.rectangularSize !== undefined)
			this.rectangularSize.set(key, values.rectangularSize)
		if (values.health !== undefined)
			this.health.set(key, values.health)
		if (values.orientation !== undefined)
			this.orientation.set(key, values.orientation)
		if (values.position !== undefined)
			this.position.set(key, values.position)
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
			rectangularSize: this.rectangularSize.get(key),
			health: this.health.get(key),
			orientation: this.orientation.get(key),
			position: this.position.get(key),
			velocity: this.velocity.get(key),
			shipBehaviour: this.shipBehaviour.get(key),
			obstacleBehaviour: this.obstacleBehaviour.get(key),
			dieOnCollisionBehaviour: this.dieOnCollisionBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	rectangularSize?: RectangularSize
	health?: number
	position?: Vector2
	velocity?: Vector2
	orientation?: number
	shipBehaviour?: boolean
	obstacleBehaviour?: boolean
	dieOnCollisionBehaviour?: boolean
}
