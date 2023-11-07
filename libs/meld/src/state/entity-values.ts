import { BaseValues, CircularSize, EntityIdOf, EntityTypeOf, Id } from "@lundin/age"
import { GridVector, Vector3 } from "@lundin/utility"
import { BlockArea } from "../values/block-area"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"
import { ToolState } from "../values/tool-state"
import { Item } from "./item"

export class EntityValues extends BaseValues {
	constructor(
		public readonly CircularSize = new Map<Id, CircularSize>(),
		public readonly BlockArea = new Map<Id, BlockArea>(),
		public readonly BlockPosition = new Map<Id, GridVector>(),
		public readonly Damage = new Map<Id, number>(),
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
		public readonly PlayerBehaviour = new Map<Id, boolean>(),
		Entities = new Map<Id, boolean>(),
	) {
		super(Entities)
		this.Register(CircularSize)
		this.Register(BlockArea)
		this.Register(BlockPosition)
		this.Register(Damage)
		this.Register(DashState)
		this.Register(DespawnTime)
		this.Register(Health)
		this.Register(Orientation)
		this.Register(Position)
		this.Register(SelectableItems)
		this.Register(SelectableTools)
		this.Register(TargetVelocity)
		this.Register(ToolState)
		this.Register(Velocity)
		this.Register(BlockCollisionBehaviour)
		this.Register(GravityBehaviour)
		this.Register(PlayerBehaviour)
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
		if (values.BlockArea !== undefined)
			this.BlockArea.set(key, values.BlockArea)
		if (values.BlockPosition !== undefined)
			this.BlockPosition.set(key, values.BlockPosition)
		if (values.Damage !== undefined)
			this.Damage.set(key, values.Damage)
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
		if (values.PlayerBehaviour !== undefined)
			this.PlayerBehaviour.set(key, values.PlayerBehaviour)
	}

	GroupFor(key: Id): GroupedEntityValues {
		return {
			CircularSize: this.CircularSize.get(key),
			BlockArea: this.BlockArea.get(key),
			BlockPosition: this.BlockPosition.get(key),
			Damage: this.Damage.get(key),
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
			PlayerBehaviour: this.PlayerBehaviour.get(key),
		}
	}
}

export interface GroupedEntityValues {
	CircularSize?: CircularSize
	BlockArea?: BlockArea
	BlockPosition?: GridVector
	Damage?: number
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
	PlayerBehaviour?: boolean
}

export class SerialisableEntities {
	public static From(entityValues: EntityValues): Map<Id, GroupedEntityValues> {
		const map = new Map<Id, GroupedEntityValues>()
		for (const [key] of entityValues.Entities)
			map.set(key, entityValues.GroupFor(key))
		return map
	}

	public static ToEntityValuesWithMapping(
		serialised: Map<Id, GroupedEntityValues>,
		entityMapping: Map<Id, Id>,
		solidMapping: Map<Id, Id>,
		itemMapping: Map<Id, Id>
	): EntityValues {
		const entityValues = new EntityValues()
		for (const [id, values] of serialised)
			entityValues.AddValuesFrom(this.MapEntity(id, entityMapping), this.MapValues(values, solidMapping, itemMapping))
		return entityValues
	}

	public static ToEntityValues(serialised: Map<Id, GroupedEntityValues>): EntityValues {
		const entityValues = new EntityValues()
		for (const [id, values] of serialised.entries())
			entityValues.AddValuesFrom(id, values)
		return entityValues
	}

	public static MapEntity(entity: Id, entityMapping: Map<Id, Id>): Id {
		const type = entityMapping.get(EntityTypeOf(entity))
		const id = EntityIdOf(entity)
		return type | id
	}

	public static MapValues(values: GroupedEntityValues, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): GroupedEntityValues {
		return {
			...values,
			SelectableItems: this.MapSelectableItems(values.SelectableItems, solidMapping, itemMapping),
			SelectableTools: this.MapSelectableTools(values.SelectableTools, solidMapping, itemMapping),
			ToolState: this.MapToolState(values.ToolState, solidMapping, itemMapping),
		}
	}

	static MapSelectableItems(selectableItems: SelectableItems, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): SelectableItems {
		if (!selectableItems)
			return null
		return new SelectableItems(
			selectableItems.Items.map(x => this.MapItem(x, solidMapping, itemMapping)),
			selectableItems.CurrentSet,
			selectableItems.CurrentItemInSet,
		)
	}

	static MapSelectableTools(selectableTools: SelectableTools, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): SelectableTools {
		if (!selectableTools)
			return null
		return new SelectableTools(
			selectableTools.Items.map(x => this.MapItem(x, solidMapping, itemMapping)),
			selectableTools.CurrentToolIndex,
		)
	}

	static MapToolState(toolState: ToolState, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): ToolState {
		if (!toolState)
			return null
		return new ToolState(
			toolState.Action,
			this.MapItem(toolState.SourceItem, solidMapping, itemMapping),
			toolState.SubEntities,
			toolState.Target,
			toolState.StartTime,
			toolState.EndTime,
			toolState.LockOrientation,
			toolState.BlockMovement,
		)
	}

	static MapItem(item: Item, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): Item {
		if (!item)
			return null
		return new Item(
			itemMapping.get(item.Type),
			solidMapping.get(item.Content), // TODO: it won't always be a SolidId
			item.Amount,
		)
	}
}
