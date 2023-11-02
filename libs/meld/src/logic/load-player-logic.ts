import { GameLogic } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Changes } from "../state/changes"
import { GameState } from "../state/game-state"
import { GameUpdate, LoadPlayer, UnloadPlayer } from "../state/game-update"
import { Item } from "../state/item"
import { MeldEntities } from "../state/meld-entities"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"

export class LoadPlayerLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private State: GameState,
		private Changes: Changes,
		private Entities: MeldEntities,
	) { }

	Update(updates: GameUpdate[]) {
		for (const update of updates) {
			if (update instanceof LoadPlayer)
				this.LoadPlayer(update.Player)
			else if (update instanceof UnloadPlayer)
				this.UnloadPlayer(update.Player)
		}
	}

	private LoadPlayer(player: string) {
		const loaded = this.State.LoadPlayer(player)
		if (!loaded)
			this.SpawnPlayer(player)
	}

	private UnloadPlayer(player: string) {
		const id = this.State.Players.get(player) // TODO: what happens when no entry?
		if (!id)
			return
		this.State.UnloadPlayer(player)
		this.Changes.EntityValues.RemoveValuesFor(id)
		this.Changes.EntityValues.Entities.delete(id)
	}

	private SpawnPlayer(player: string) {
		const Config = this.Config
		const id = this.Entities.Create(Config.Constants.PlayerType)
		this.Entities.Position.Set.For(id, new Vector3(0, 0, 5))

		const items = [
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("grass-rich"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkstone"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("stone-block"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("stone-flagstone"), 0),

			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("soil-rich"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("soil-poor"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkstone-block"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkstone-flagstone"), 0),

			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkwood"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkwood-beam"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkwood-planks"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("darkwood-planks-weathered"), 0),

			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("wood"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("wood-beam"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("wood-planks"), 0),
			new Item(Config.Constants.SolidItemType, Config.SolidTypeMap.TypeIdFor("wood-planks-weathered"), 0),
		]
		this.Entities.SelectableItems.Set.For(id, new SelectableItems(items))

		const tools = [
			new Item(Config.ItemTypeMap.TypeIdFor("basic-hammer"), 0, 0),
			null, null, null,
		]
		this.Entities.SelectableTools.Set.For(id, new SelectableTools(tools))
		this.State.Players.set(player, id)
	}
}