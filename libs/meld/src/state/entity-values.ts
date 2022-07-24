import { BaseValues, CircularSize, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"

export class EntityValues extends BaseValues {
	constructor(
		public readonly CircularSize = new Map<Id, CircularSize>(),
		public readonly DashState = new Map<Id, DashState>(),
		public readonly Health = new Map<Id, number>(),
		public readonly Orientation = new Map<Id, number>(),
		public readonly Position = new Map<Id, Vector3>(),
		public readonly SelectableItems = new Map<Id, SelectableItems>(),
		public readonly TargetVelocity = new Map<Id, Vector3>(),
		public readonly Velocity = new Map<Id, Vector3>(),
		public readonly BlockCollisionBehaviour = new Map<Id, boolean>(),
		public readonly GravityBehaviour = new Map<Id, boolean>(),
		Entities = new Map<Id, boolean>(),
	) {
		super(Entities)
		this.register(CircularSize)
		this.register(DashState)
		this.register(Health)
		this.register(Orientation)
		this.register(Position)
		this.register(SelectableItems)
		this.register(TargetVelocity)
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
		this.Entities.set(key, true)
		if (values.CircularSize !== undefined)
			this.CircularSize.set(key, values.CircularSize)
		if (values.DashState !== undefined)
			this.DashState.set(key, values.DashState)
		if (values.Health !== undefined)
			this.Health.set(key, values.Health)
		if (values.Orientation !== undefined)
			this.Orientation.set(key, values.Orientation)
		if (values.Position !== undefined)
			this.Position.set(key, values.Position)
		if (values.SelectableItems !== undefined)
			this.SelectableItems.set(key, values.SelectableItems)
		if (values.TargetVelocity !== undefined)
			this.TargetVelocity.set(key, values.TargetVelocity)
		if (values.Velocity !== undefined)
			this.Velocity.set(key, values.Velocity)
		if (values.BlockCollisionBehaviour !== undefined)
			this.BlockCollisionBehaviour.set(key, values.BlockCollisionBehaviour)
		if (values.GravityBehaviour !== undefined)
			this.GravityBehaviour.set(key, values.GravityBehaviour)
	}

	GroupFor(key: Id): GroupedEntityValues {
		return {
			CircularSize: this.CircularSize.get(key),
			DashState: this.DashState.get(key),
			Health: this.Health.get(key),
			Orientation: this.Orientation.get(key),
			Position: this.Position.get(key),
			SelectableItems: this.SelectableItems.get(key),
			TargetVelocity: this.TargetVelocity.get(key),
			Velocity: this.Velocity.get(key),
			BlockCollisionBehaviour: this.BlockCollisionBehaviour.get(key),
			GravityBehaviour: this.GravityBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	CircularSize?: CircularSize
	DashState?: DashState
	Health?: number
	Orientation?: number
	Position?: Vector3
	SelectableItems?: SelectableItems
	TargetVelocity?: Vector3
	Velocity?: Vector3
	BlockCollisionBehaviour?: boolean
	GravityBehaviour?: boolean
}
