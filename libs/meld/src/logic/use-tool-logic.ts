import { GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, BlockType, Blocks } from "../state/block"
import { ActionState, GameUpdate, UseToolAction } from "../state/game-update"
import { Globals } from "../state/globals"
import { Item, ItemKind } from "../state/item"
import { MeldEntities } from "../state/meld-entities"
import { Region } from "../state/region"
import { SelectableTools } from "../values/selectable-tools"
import { ToolAction, ToolState } from "../values/tool-state"

export class UseToolLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private Globals: Globals,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block, Region>,
		private SetDespawnTime: ValueSetter<number>,
		private Position: ValueGetter<Vector3>,
		private SetPosition: ValueSetter<Vector3>,
		private SelectableTools: ValueGetter<SelectableTools>,
		private ToolState: ValueGetter<ToolState>,
		private SetToolState: ValueSetter<ToolState>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	Update(actions: GameUpdate[]) {
		for (const [entity, state] of this.Entities.With.ToolState)
			this.UpdateState(entity, state)

		for (const action of actions)
			if (action instanceof UseToolAction)
				this.UseTool(action)
	}

	private UseTool(action: UseToolAction) {
		const selectableTools = this.SelectableTools.Of(action.Entity)
		if (!selectableTools)
			return
		const tool = selectableTools.CurrentTool()
		if (!tool)
			return
		if (this.Config.ItemValues.get(tool.Type)?.Kind == ItemKind.Hammer)
			this.HandleHammer(action, tool)
	}

	private HandleHammer(action: UseToolAction, tool: Item) {
		if (action.PrimaryActionState === ActionState.Start)
			this.HandleHammerStartPrimary(action, tool)
		else if (action.PrimaryActionState === ActionState.Unchanged)
			this.HandleHammerUpdatePrimary(action)
		else if (action.PrimaryActionState === ActionState.End)
			this.HandleHammerEndPrimary(action, tool)
	}

	private HandleHammerStartPrimary(action: UseToolAction, tool: Item) {
		const state = this.ToolState.Of(action.Entity) ?? new ToolState(ToolAction.HammerStrike, tool, [], action.Target)
		if (this.Globals.Tick < state.EndTime)
			return

		this.SetToolState.For(action.Entity, ToolState.From({
			...state,
			Action: ToolAction.HammerStrike,
			StartTime: this.Globals.Tick,
			EndTime: Number.MAX_SAFE_INTEGER,
			Target: action.Target,
		}))
	}

	private HandleHammerUpdatePrimary(action: UseToolAction) {
		const state = this.ToolState.Of(action.Entity)
		if (!state)
			return
		if (state.EndTime <= this.Globals.Tick)
			return

		this.SetToolState.For(action.Entity, ToolState.From({
			...state,
			Target: action.Target,
		}))
	}

	private HandleHammerEndPrimary(action: UseToolAction, tool: Item) {
		const state = this.ToolState.Of(action.Entity) ?? new ToolState(ToolAction.HammerStrike, tool, [], action.Target)
		this.SetToolState.For(action.Entity, ToolState.From({
			...state,
			EndTime: 0,
		}))
	}

	private UpdateState(entity: Id, state: ToolState) {
		if (state.EndTime <= this.Globals.Tick)
			return
		const position = this.Position.CurrentlyOf(entity) ?? new Vector3(0, 0, 0)
		const velocity = this.Velocity.CurrentlyOf(entity) ?? new Vector3(0, 0, 0)

		const subEntities = this.UpdateSubEntities(state.SubEntities, velocity)

		const timePassed = this.Globals.Tick - state.StartTime
		if (timePassed % 30 == 20) {
			const hitEntity = this.HammerStrikeHit(state, position, velocity)
			subEntities.push(hitEntity)
			this.SetToolState.For(entity, ToolState.From({
				...state,
				SubEntities: subEntities,
			}))
		}
		else if (subEntities.length !== state.SubEntities.length) {
			this.SetToolState.For(entity, ToolState.From({
				...state,
				SubEntities: subEntities,
			}))
		}
	}

	private UpdateSubEntities(subEntities: Id[], velocity: Vector3) {
		const remainingEntities: Id[] = []
		for (const subEntity of subEntities) {
			if (!this.Entities.Exists(subEntity))
				continue
			this.SetVelocity.For(subEntity, velocity)
			remainingEntities.push(subEntity)
		}
		return remainingEntities
	}

	private HammerStrikeHit(state: ToolState, position: Vector3, velocity: Vector3) {
		this.MineBlockAt(state.Target)
		return this.CreateHitFor(position, velocity)
	}

	private CreateHitFor(position: Vector3, velocity: Vector3) {
		const subEntity = this.Entities.Create(this.Config.EntityTypeMap.TypeIdFor("despawning"))
		this.SetPosition.For(subEntity, new Vector3(0, 1, 0.5).addFrom(position).addFrom(velocity))
		this.SetDespawnTime.For(subEntity, this.Globals.Tick + 3)
		return subEntity
	}

	private MineBlockAt(target: Vector3) {
		const currentBlock = this.Terrain.GetAt(target)
		if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.Terrain.SetAt(target, Blocks.NewEmpty(Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.Terrain.SetAt(target, Blocks.NewFloor(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Full)
			this.Terrain.SetAt(target, Blocks.NewHalf(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
	}
}
