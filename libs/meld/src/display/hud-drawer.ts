import { DisplayProvider } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { SolidId } from "../state/block"
import { DisplayState } from "./display-state"

export class HudDrawer {
	static BottomLayer = 0.9998
	static TopLayer = 0.9999

	constructor(
		private game: Meld,
		private state: DisplayState,
		private displayProvider: DisplayProvider,
	) { }

	draw() {
		const playerId = this.game.state.players.get(this.state.playerName)
		if (!(playerId > -1))
			return
		this.drawHud()
		const selectedBlock = this.game.entities.selectedBlock.get.of(playerId)
		if (selectedBlock > -1)
			this.drawSelectedBlock(selectedBlock)
	}

	private drawHud() {
		this.displayProvider.draw("hud-life-energy", 0, 0, 0, 0, HudDrawer.BottomLayer)
		this.displayProvider.draw("hud-tool-items", this.state.size.widthInTiles, 0, 0, 0, HudDrawer.BottomLayer)
	}

	private drawSelectedBlock(solid: SolidId) {
		const position = new Vector2(this.state.size.widthInTiles - 1, 1)
		const sprite = this.game.config.solidTypeMap.TypeFor(solid) + "-tile"
		this.displayProvider.draw(sprite, position.x, position.y, 0, 0, HudDrawer.TopLayer)
	}
}
