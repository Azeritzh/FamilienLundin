import { BaseValues, EntityManager, Id, RectangularSize } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export type MeldEntities = EntityManager<EntityValues>

export class EntityValues extends BaseValues {
	constructor(
		public readonly health = new Map<Id, number>(),
		public readonly orientation = new Map<Id, number>(),
		public readonly position = new Map<Id, Vector3>(),
		public readonly rectangularSize = new Map<Id, RectangularSize>(),
		public readonly selectedBlock = new Map<Id, Id>(),
		public readonly velocity = new Map<Id, Vector3>(),
		entities = new Map<Id, boolean>(),
	) {
		super(entities)
		this.register(health)
		this.register(orientation)
		this.register(position)
		this.register(rectangularSize)
		this.register(selectedBlock)
		this.register(velocity)
	}

	public static from(groupedValues: Map<Id, GroupedEntityValues>) {
		const entityValues = new EntityValues()
		for (const [id, values] of groupedValues)
			entityValues.addValuesFrom(id, values)
		return entityValues
	}

	addValuesFrom(key: Id, values: GroupedEntityValues) {
		if (values.health !== undefined)
			this.health.set(key, values.health)
		if (values.orientation !== undefined)
			this.orientation.set(key, values.orientation)
		if (values.position !== undefined)
			this.position.set(key, values.position)
		if (values.rectangularSize !== undefined)
			this.rectangularSize.set(key, values.rectangularSize)
		if (values.selectedBlock !== undefined)
			this.selectedBlock.set(key, values.selectedBlock)
		if (values.velocity !== undefined)
			this.velocity.set(key, values.velocity)
	}

	groupFor(key: Id): GroupedEntityValues {
		return {
			health: this.health.get(key),
			orientation: this.orientation.get(key),
			position: this.position.get(key),
			rectangularSize: this.rectangularSize.get(key),
			selectedBlock: this.selectedBlock.get(key),
			velocity: this.velocity.get(key),
		}
	}
}

export interface GroupedEntityValues {
	health?: number
	orientation?: number
	position?: Vector3
	rectangularSize?: RectangularSize
	selectedBlock?: Id
	velocity?: Vector3
}
