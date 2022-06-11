import { BaseValues, EntityManager, Id, ValueAccessor } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RectangularSize } from "../values/rectangular-size"

export type RenderendEntityValues<T> = ValueAccessor<T, GroupedEntityValues>
export type RenderendEntities = EntityManager<EntityValues, GroupedEntityValues, Behaviour>

export class EntityValues extends BaseValues {
	constructor(
		public readonly rectangularSize = new Map<Id, RectangularSize>(),
		public readonly health = new Map<Id, number>(),
		public readonly orientation = new Map<Id, number>(),
		public readonly position = new Map<Id, Vector2>(),
		public readonly velocity = new Map<Id, Vector2>(),
	) {
		super()
		this.register(rectangularSize)
		this.register(health)
		this.register(orientation)
		this.register(position)
		this.register(velocity)
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
	}

	groupFor(key: Id): GroupedEntityValues {
		return {
			rectangularSize: this.rectangularSize.get(key),
			health: this.health.get(key),
			orientation: this.orientation.get(key),
			position: this.position.get(key),
			velocity: this.velocity.get(key),
		}
	}
}

export interface GroupedEntityValues {
	rectangularSize?: RectangularSize
	health?: number
	position?: Vector2
	velocity?: Vector2
	orientation?: number
}

export enum Behaviour {
	Velocity,
	Obstacle,
	Ship,
	DieOnCollision,
	HasRectangularSize,
}
