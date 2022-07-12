import { DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { SolidId } from "../state/block"
import { DisplayState } from "./display-state"

export class HudDrawer {
	static BottomLayer = 0.9998
	static TopLayer = 0.9999

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private DisplayProvider: DisplayProvider,
	) { }

	Draw() {
		const playerId = this.Game.State.Players.get(this.State.PlayerName)
		if (!(playerId > -1))
			return
		this.drawHud()
		const selectedBlock = this.Game.Entities.SelectedBlock.get.of(playerId)
		if (selectedBlock > -1)
			this.drawSelectedBlock(selectedBlock)
	}

	private drawHud() {
		this.DisplayProvider.draw("hud-life-energy", 0, 0, 0, 0, HudDrawer.BottomLayer)
		this.DisplayProvider.draw("hud-tool-items", this.State.Size.widthInTiles, 0, 0, 0, HudDrawer.BottomLayer)
	}

	private drawSelectedBlock(solid: SolidId) {
		const position = new Vector2(this.State.Size.widthInTiles - 1, 1)
		const sprite = this.Game.Config.SolidTypeMap.TypeFor(solid) + "-tile"
		this.DisplayProvider.draw(sprite, position.x, position.y, 0, 0, HudDrawer.TopLayer)
	}
}
