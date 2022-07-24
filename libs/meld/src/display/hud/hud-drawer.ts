import { DisplayProvider, Id } from "@lundin/age"
import { Meld } from "../../meld"
import { Item } from "../../state/item"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"

export class HudDrawer {
	static BottomLayer = 0.9998
	static TopLayer = 0.9999

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private DisplayProvider: DisplayProvider,
	) { }

	Draw() {
		const playerId = this.Game.State.Players.get(this.State.PlayerName)
		if (!(playerId > -1))
			return
		this.DrawHud()
		this.DrawItems(playerId)
	}

	private DrawHud() {
		this.DisplayProvider.draw("hud-life-energy", 0, 0, 0, 0, HudDrawer.BottomLayer)
		this.DisplayProvider.draw("hud-tool-items", this.State.Size.widthInTiles, 0, 0, 0, HudDrawer.BottomLayer)
	}

	private DrawItems(player: Id) {
		const items = this.Game.Entities.SelectableItems.Get.Of(player)
		if (!items)
			return
		const topItem = items.ItemInCurrentSet(0)
		if (topItem)
			this.DrawItem(topItem, 3, 1.5)

		const rightItem = items.ItemInCurrentSet(1)
		if (rightItem)
			this.DrawItem(rightItem, 4.5, 3)

		const bottomItem = items.ItemInCurrentSet(2)
		if (bottomItem)
			this.DrawItem(bottomItem, 3, 4.5)

		const leftItem = items.ItemInCurrentSet(3)
		if (leftItem)
			this.DrawItem(leftItem, 1.5, 3)

		let buttonX = 0
		let buttonY = 0
		switch (items.CurrentItemInSet) {
			case 0:
				buttonX = 3
				buttonY = 2.5
				break
			case 1:
				buttonX = 3.5
				buttonY = 3
				break
			case 2:
				buttonX = 3
				buttonY = 3.5
				break
			case 3:
				buttonX = 2.5
				buttonY = 3
				break
		}
		this.DisplayProvider.draw("button-y", buttonX, buttonY, 0, 0, HudDrawer.TopLayer)
	}

	private DrawItem(item: Item, x: number, y: number) {
		const sprite = this.Config.ItemSprites.has(item.Type)
			? this.Config.ItemSprites.get(item.Type)
			: this.Config.BlockSprites.get(item.Content)[0].TileFor(this.State.ViewDirection)
		this.DisplayProvider.draw(sprite, x, y, 0, 0, HudDrawer.TopLayer)
	}
}
