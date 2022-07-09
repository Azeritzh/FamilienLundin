import { DisplayProvider, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Meld } from "../meld"
import { DisplayState } from "./display-state"

export class HudDrawer {
	constructor(
		private game: Meld,
		private state: DisplayState,
		private displayProvider: DisplayProvider,
	) { }

	draw() {
		const playerId = this.game.state.players.get(this.state.playerName)
		if (!(playerId > -1))
			return
		const selectedBlock = this.game.entities.selectedBlock.get.of(playerId)
		if (selectedBlock > -1)
			this.drawSelectedBlock(selectedBlock)
	}

	private drawSelectedBlock(block: Id) {
		const position = new Vector2(this.state.size.widthInTiles - 1.5, 0.5)
		const sprite = this.game.config.solidTypeMap.typeFor(block) + "-tile"
		this.displayProvider.draw(sprite, position.x, position.y, 0, 0)
	}
}
