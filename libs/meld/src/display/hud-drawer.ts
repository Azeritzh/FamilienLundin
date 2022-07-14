import { DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { SolidId } from "../state/block"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

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
		const selectedBlock = this.Game.Entities.SelectedBlock.Get.Of(playerId)
		if (selectedBlock > -1)
			this.DrawSelectedBlock(selectedBlock)
	}

	private DrawHud() {
		this.DisplayProvider.draw("hud-life-energy", 0, 0, 0, 0, HudDrawer.BottomLayer)
		this.DisplayProvider.draw("hud-tool-items", this.State.Size.widthInTiles, 0, 0, 0, HudDrawer.BottomLayer)
	}

	private DrawSelectedBlock(solid: SolidId) {
		const position = new Vector2(this.State.Size.widthInTiles - 1, 1)
		const sprite = this.Config.BlockSprites.get(solid)[0].TileFor(this.State.ViewDirection)
		this.DisplayProvider.draw(sprite, position.x, position.y, 0, 0, HudDrawer.TopLayer)
	}
}
