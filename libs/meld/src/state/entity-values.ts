import { BaseValues, CircularSize, EntityManager, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { SolidId } from "./block"

export type MeldEntities = EntityManager<EntityValues>

export class EntityValues extends BaseValues {
	constructor(
		public readonly Health = new Map<Id, number>(),
		public readonly Orientation = new Map<Id, number>(),
		public readonly Position = new Map<Id, Vector3>(),
		public readonly CircularSize = new Map<Id, CircularSize>(),
		public readonly SelectedBlock = new Map<Id, SolidId>(),
		public readonly Velocity = new Map<Id, Vector3>(),
		public readonly BlockCollisionBehaviour = new Map<Id, boolean>(),
		public readonly GravityBehaviour = new Map<Id, boolean>(),
		Entities = new Map<Id, boolean>(),
	) {
		super(Entities)
		this.register(Health)
		this.register(Orientation)
		this.register(Position)
		this.register(CircularSize)
		this.register(SelectedBlock)
		this.register(Velocity)
		this.register(BlockCollisionBehaviour)
		this.register(GravityBehaviour)
	}

	public static From(groupedValues: Map<Id, GroupedEntityValues>) {
		const entityValues = new EntityValues()
		for (const [id, values] of groupedValues)
			entityValues.AddValuesFrom(id, values)
		return entityValues
	}

	AddValuesFrom(key: Id, values: GroupedEntityValues) {
		this.entities.set(key, true)
		if (values.Health !== undefined)
			this.Health.set(key, values.Health)
		if (values.Orientation !== undefined)
			this.Orientation.set(key, values.Orientation)
		if (values.Position !== undefined)
			this.Position.set(key, values.Position)
		if (values.CircularSize !== undefined)
			this.CircularSize.set(key, values.CircularSize)
		if (values.SelectedBlock !== undefined)
			this.SelectedBlock.set(key, values.SelectedBlock)
		if (values.Velocity !== undefined)
			this.Velocity.set(key, values.Velocity)
		if (values.BlockCollisionBehaviour !== undefined)
			this.BlockCollisionBehaviour.set(key, values.BlockCollisionBehaviour)
		if (values.GravityBehaviour !== undefined)
			this.GravityBehaviour.set(key, values.GravityBehaviour)
	}

	GroupFor(key: Id): GroupedEntityValues {
		return {
			Health: this.Health.get(key),
			Orientation: this.Orientation.get(key),
			Position: this.Position.get(key),
			CircularSize: this.CircularSize.get(key),
			SelectedBlock: this.SelectedBlock.get(key),
			Velocity: this.Velocity.get(key),
			BlockCollisionBehaviour: this.BlockCollisionBehaviour.get(key),
			GravityBehaviour: this.GravityBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	Health?: number
	Orientation?: number
	Position?: Vector3
	CircularSize?: CircularSize
	SelectedBlock?: SolidId
	Velocity?: Vector3
	BlockCollisionBehaviour: boolean
	GravityBehaviour: boolean
}
