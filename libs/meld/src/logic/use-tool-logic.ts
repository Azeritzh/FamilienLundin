import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks, BlockType } from "../state/block"
import { GameUpdate, UseToolAction, UseToolActionType } from "../state/game-update"
import { ItemKind } from "../state/item"
import { SelectableTools } from "../values/selectable-tools"

export class UseToolLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private Terrain: TerrainManager<Block>,
		private SelectableTools: ValueGetter<SelectableTools>
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof UseToolAction)
				this.UseItem(action.Entity, action.ActionType, action.Target)
	}

	private UseItem(entity: Id, actionType: UseToolActionType, position: Vector3) {
		const selectableTools = this.SelectableTools.Of(entity)
		const tool = selectableTools?.CurrentTool()
		if (!tool)
			return
		if (this.Config.ItemValues.get(tool.Type)?.Kind === ItemKind.Hammer)
			this.PlaceBlock(actionType, position)
	}

	private PlaceBlock(actionType: UseToolActionType, position: Vector3) {
		if (actionType != UseToolActionType.EndPrimary)
			return

		const currentBlock = this.Terrain.GetAt(position) ?? Blocks.NewEmpty(0)
		if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.Terrain.SetAt(position, Blocks.NewEmpty(Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.Terrain.SetAt(position, Blocks.NewFloor(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Full)
			this.Terrain.SetAt(position, Blocks.NewHalf(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
	}
}
