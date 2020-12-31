import { Component, ViewChild } from "@angular/core"
import { VirusGameComponent } from "./virus-game/virus-game.component"

@Component({
	selector: "lundin-virus",
	templateUrl: "./virus.component.html",
	styleUrls: ["./virus.component.scss"],
})
export class VirusComponent {
	@ViewChild(VirusGameComponent) gameComponent: VirusGameComponent
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "green", playerId: 2 },
	]
	boardSize = 8
	fieldSize = 50
	autoSize = true

	triggerNewGame() {
		if (this.gameComponent.game.state.tick === 0)
			this.gameComponent.startGame()
	}
}
