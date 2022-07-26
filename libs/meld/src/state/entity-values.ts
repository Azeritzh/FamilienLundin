import { BaseValues, CircularSize, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"
import { ToolState } from "../values/tool-state"

export class EntityValues extends BaseValues {
	constructor(
		public readonly CircularSize = new Map<Id, CircularSize>(),
		public readonly DashState = new Map<Id, DashState>(),
		public readonly DespawnTime = new Map<Id, number>(),
		public readonly Health = new Map<Id, number>(),
		public readonly Orientation = new Map<Id, number>(),
		public readonly Position = new Map<Id, Vector3>(),
		public readonly SelectableItems = new Map<Id, SelectableItems>(),
		public readonly SelectableTools = new Map<Id, SelectableTools>(),
		public readonly TargetVelocity = new Map<Id, Vector3>(),
		public readonly ToolState = new Map<Id, ToolState>(),
		public readonly Velocity = new Map<Id, Vector3>(),
		public readonly BlockCollisionBehaviour = new Map<Id, boolean>(),
		public readonly GravityBehaviour = new Map<Id, boolean>(),
		Entities = new Map<Id, boolean>(),
	) {
		super(Entities)
		this.register(CircularSize)
		this.register(DashState)
		this.register(DespawnTime)
		this.register(Health)
		this.register(Orientation)
		this.register(Position)
		this.register(SelectableItems)
		this.register(SelectableTools)
		this.register(TargetVelocity)
		this.register(ToolState)
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
		if (values.DespawnTime !== undefined)
			this.DespawnTime.set(key, values.DespawnTime)
		if (values.Health !== undefined)
			this.Health.set(key, values.Health)
		if (values.Orientation !== undefined)
			this.Orientation.set(key, values.Orientation)
		if (values.Position !== undefined)
			this.Position.set(key, values.Position)
		if (values.SelectableItems !== undefined)
			this.SelectableItems.set(key, values.SelectableItems)
		if (values.SelectableTools !== undefined)
			this.SelectableTools.set(key, values.SelectableTools)
		if (values.TargetVelocity !== undefined)
			this.TargetVelocity.set(key, values.TargetVelocity)
		if (values.ToolState !== undefined)
			this.ToolState.set(key, values.ToolState)
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
			DespawnTime: this.DespawnTime.get(key),
			Health: this.Health.get(key),
			Orientation: this.Orientation.get(key),
			Position: this.Position.get(key),
			SelectableItems: this.SelectableItems.get(key),
			SelectableTools: this.SelectableTools.get(key),
			TargetVelocity: this.TargetVelocity.get(key),
			ToolState: this.ToolState.get(key),
			Velocity: this.Velocity.get(key),
			BlockCollisionBehaviour: this.BlockCollisionBehaviour.get(key),
			GravityBehaviour: this.GravityBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	CircularSize?: CircularSize
	DashState?: DashState
	DespawnTime?: number
	Health?: number
	Orientation?: number
	Position?: Vector3
	SelectableItems?: SelectableItems
	SelectableTools?: SelectableTools
	TargetVelocity?: Vector3
	ToolState?: ToolState
	Velocity?: Vector3
	BlockCollisionBehaviour?: boolean
	GravityBehaviour?: boolean
}
