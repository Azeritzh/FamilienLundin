import { DisplayProvider, Id } from "@lundin/age"
import { Meld } from "../../meld"
import { Item } from "../../state/item"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { UiDisplay } from "./ui-display"

export class HudDrawer {
	private Player!: Id

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private DisplayProvider: DisplayProvider,
	) { }

	Draw(player: Id) {
		this.Player = player
		this.DrawHud()
		this.DrawItems()
		this.DrawToolSection()
	}

	private DrawHud() {
		this.DisplayProvider.Draw(this.Config.GameplaySprites.HudLeft, 0, 0, 0, 0, UiDisplay.BottomLayer)
		this.DisplayProvider.Draw(this.Config.GameplaySprites.HudRight, this.State.Size.WidthInTiles, 0, 0, 0, UiDisplay.BottomLayer)
	}

	private DrawItems() {
		const items = this.Game.Entities.SelectableItems.Get.Of(this.Player)
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
		this.DisplayProvider.Draw("ui-button-y", buttonX, buttonY, 0, 0, UiDisplay.TopLayer)
	}

	private DrawToolSection() {
		const tool = this.Game.Entities.SelectableTools.Get.Of(this.Player)?.CurrentTool()
		if (!tool)
			return
		this.DrawItem(tool, this.State.Size.WidthInTiles - 3, 4.5)
		this.DisplayProvider.Draw("ui-button-a", this.State.Size.WidthInTiles - 2.25, 5, 0, 0, UiDisplay.TopLayer)
		this.DisplayProvider.Draw("ui-button-x", this.State.Size.WidthInTiles - 3.75, 5, 0, 0, UiDisplay.TopLayer)

		this.DisplayProvider.Draw(this.Config.GameplaySprites.Dash.Target, this.State.Size.WidthInTiles - 1.5, 3, 0, 0, UiDisplay.TopLayer)
		this.DisplayProvider.Draw("ui-button-b", this.State.Size.WidthInTiles - 0.75, 3.5, 0, 0, UiDisplay.TopLayer)
	}

	private DrawItem(item: Item, x: number, y: number) {
		const sprite = this.Config.ItemSprites.has(item.Type)
			? this.Config.ItemSprites.get(item.Type)!
			: this.Config.BlockSprites.get(item.Content)![0].TileFor(this.State.ViewDirection)
		this.DisplayProvider.Draw(sprite, x, y, 0, 0, UiDisplay.TopLayer)
	}
}
