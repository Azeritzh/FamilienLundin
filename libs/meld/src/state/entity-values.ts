import { BaseValues, CircularSize, EntityManager, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"

export type MeldEntities = EntityManager<EntityValues>

export class EntityValues extends BaseValues {
	constructor(
		public readonly health = new Map<Id, number>(),
		public readonly orientation = new Map<Id, number>(),
		public readonly position = new Map<Id, Vector3>(),
		public readonly circularSize = new Map<Id, CircularSize>(),
		public readonly selectedBlock = new Map<Id, Id>(),
		public readonly velocity = new Map<Id, Vector3>(),
		public readonly blockCollisionBehaviour = new Map<Id, boolean>(),
		entities = new Map<Id, boolean>(),
	) {
		super(entities)
		this.register(health)
		this.register(orientation)
		this.register(position)
		this.register(circularSize)
		this.register(selectedBlock)
		this.register(velocity)
		this.register(blockCollisionBehaviour)
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
		if (values.circularSize !== undefined)
			this.circularSize.set(key, values.circularSize)
		if (values.selectedBlock !== undefined)
			this.selectedBlock.set(key, values.selectedBlock)
		if (values.velocity !== undefined)
			this.velocity.set(key, values.velocity)
		if (values.blockCollisionBehaviour !== undefined)
			this.blockCollisionBehaviour.set(key, values.blockCollisionBehaviour)
	}

	groupFor(key: Id): GroupedEntityValues {
		return {
			health: this.health.get(key),
			orientation: this.orientation.get(key),
			position: this.position.get(key),
			circularSize: this.circularSize.get(key),
			selectedBlock: this.selectedBlock.get(key),
			velocity: this.velocity.get(key),
			blockCollisionBehaviour: this.blockCollisionBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	health?: number
	orientation?: number
	position?: Vector3
	circularSize?: CircularSize
	selectedBlock?: Id
	velocity?: Vector3
	blockCollisionBehaviour: boolean
}
