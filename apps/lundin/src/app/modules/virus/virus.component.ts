import { Component, ViewChild } from "@angular/core"
import { VirusGameComponent, VirusPlayer } from "./virus-game/virus-game.component"

@Component({
	selector: "lundin-virus",
	templateUrl: "./virus.component.html",
	styleUrls: ["./virus.component.scss"],
})
export class VirusComponent {
	@ViewChild(VirusGameComponent) gameComponent: VirusGameComponent
	players = [
		new VirusPlayer("Spiller 1", "red"),
		new VirusPlayer("Spiller 2", "green"),
	]
	boardSize = 8
	fieldSize = 50
	autoSize = true

	triggerNewGame(force = false) {
		if (force || this.gameComponent.game.state.tick === 0)
			this.gameComponent.startGame()
	}
}
