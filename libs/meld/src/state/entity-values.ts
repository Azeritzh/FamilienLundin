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

	public AddFromOther(otherValues: EntityValues) {
		for (const [id, value] of otherValues.Entities)
			this.Entities.set(id, value)
		this.AddValuesFromOther(otherValues)
	}

	AddValuesFrom(key: Id, values: GroupedEntityValues) {
		this.Entities.set(key, true)
		if (isDefined(values.CircularSize))
			this.CircularSize.set(key, values.CircularSize)
		if (isDefined(values.BlockArea))
			this.BlockArea.set(key, values.BlockArea)
		if (isDefined(values.BlockPosition))
			this.BlockPosition.set(key, values.BlockPosition)
		if (isDefined(values.Damage))
			this.Damage.set(key, values.Damage)
		if (isDefined(values.DashState))
			this.DashState.set(key, values.DashState)
		if (isDefined(values.DespawnTime))
			this.DespawnTime.set(key, values.DespawnTime)
		if (isDefined(values.Health))
			this.Health.set(key, values.Health)
		if (isDefined(values.Orientation))
			this.Orientation.set(key, values.Orientation)
		if (isDefined(values.Position))
			this.Position.set(key, values.Position)
		if (isDefined(values.SelectableItems))
			this.SelectableItems.set(key, values.SelectableItems)
		if (isDefined(values.SelectableTools))
			this.SelectableTools.set(key, values.SelectableTools)
		if (isDefined(values.TargetVelocity))
			this.TargetVelocity.set(key, values.TargetVelocity)
		if (isDefined(values.ToolState))
			this.ToolState.set(key, values.ToolState)
		if (isDefined(values.Velocity))
			this.Velocity.set(key, values.Velocity)
		if (isDefined(values.BlockCollisionBehaviour))
			this.BlockCollisionBehaviour.set(key, values.BlockCollisionBehaviour)
		if (isDefined(values.GravityBehaviour))
			this.GravityBehaviour.set(key, values.GravityBehaviour)
		if (isDefined(values.PlayerBehaviour))
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

function isDefined<T>(value: T | undefined | null): value is T {
	return value !== undefined
}

export interface GroupedEntityValues {
	CircularSize?: CircularSize | undefined | null
	BlockArea?: BlockArea | undefined | null
	BlockPosition?: GridVector | undefined | null
	Damage?: number | undefined | null
	DashState?: DashState | undefined | null
	DespawnTime?: number | undefined | null
	Health?: number | undefined | null
	Orientation?: number | undefined | null
	Position?: Vector3 | undefined | null
	SelectableItems?: SelectableItems | undefined | null
	SelectableTools?: SelectableTools | undefined | null
	TargetVelocity?: Vector3 | undefined | null
	ToolState?: ToolState | undefined | null
	Velocity?: Vector3 | undefined | null
	BlockCollisionBehaviour?: boolean | undefined | null
	GravityBehaviour?: boolean | undefined | null
	PlayerBehaviour?: boolean | undefined | null
}

export function GroupedEntityValuesFrom(serialised: any) {
	const values: GroupedEntityValues = { ...serialised }
	if (serialised.CircularSize)
		values.CircularSize = Object.assign(new CircularSize(0, 0), serialised.CircularSize)
	if (serialised.BlockArea)
		values.BlockArea = Object.assign(new BlockArea(), serialised.BlockArea)
	if (serialised.BlockPosition)
		values.BlockPosition = Object.assign(new Vector3(0, 0, 0), serialised.BlockPosition)
	if (serialised.DashState)
		values.DashState = Object.assign(new DashState(), serialised.DashState)
	if (serialised.Position)
		values.Position = Object.assign(new Vector3(0, 0, 0), serialised.Position)
	if (serialised.SelectableItems)
		values.SelectableItems = Object.assign(new SelectableItems([]), serialised.SelectableItems)
	if (serialised.SelectableTools)
		values.SelectableTools = Object.assign(new SelectableTools([]), serialised.SelectableTools)
	if (serialised.TargetVelocity)
		values.TargetVelocity = Object.assign(new Vector3(0, 0, 0), serialised.TargetVelocity)
	if (serialised.ToolState)
		values.ToolState = ToolState.From(serialised.ToolState)
	if (serialised.Velocity)
		values.Velocity = Object.assign(new Vector3(0, 0, 0), serialised.Velocity)
	return values
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
		const type = entityMapping.get(EntityTypeOf(entity))!
		const id = EntityIdOf(entity)
		return type | id
	}

	public static MapValues(values: GroupedEntityValues, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): GroupedEntityValues {
		return {
			...values,
			SelectableItems: this.MapSelectableItems(values.SelectableItems ?? null, solidMapping, itemMapping) ?? undefined,
			SelectableTools: this.MapSelectableTools(values.SelectableTools ?? null, solidMapping, itemMapping) ?? undefined,
			ToolState: this.MapToolState(values.ToolState ?? null, solidMapping, itemMapping) ?? undefined,
		}
	}

	static MapSelectableItems(selectableItems: SelectableItems | null, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): SelectableItems | null {
		if (!selectableItems)
			return null
		return new SelectableItems(
			selectableItems.Items.map(x => this.MapItem(x, solidMapping, itemMapping)),
			selectableItems.CurrentSet,
			selectableItems.CurrentItemInSet,
		)
	}

	static MapSelectableTools(selectableTools: SelectableTools | null, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): SelectableTools | null{
		if (!selectableTools)
			return null
		return new SelectableTools(
			selectableTools.Items.map(x => this.MapNullableItem(x, solidMapping, itemMapping)),
			selectableTools.CurrentToolIndex,
		)
	}

	static MapToolState(toolState: ToolState | null, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): ToolState | null {
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

	static MapNullableItem(item: Item | null, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): Item | null {
		if (!item)
			return null
		return new Item(
			itemMapping.get(item.Type)!,
			solidMapping.get(item.Content)!, // TODO: it won't always be a SolidId
			item.Amount,
		)
	}

	static MapItem(item: Item, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): Item {
		return new Item(
			itemMapping.get(item.Type)!,
			solidMapping.get(item.Content)!, // TODO: it won't always be a SolidId
			item.Amount,
		)
	}
}
