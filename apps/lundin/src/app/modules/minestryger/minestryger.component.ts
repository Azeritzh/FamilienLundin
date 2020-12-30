import { Component, ViewChild } from "@angular/core"
import { PlayState } from "@lundin/minestryger"
import { MinestrygerGameComponent } from "./minestryger-game/minestryger-game.component"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent {
	@ViewChild(MinestrygerGameComponent) gameComponent: MinestrygerGameComponent
	width = 30
	height = 16
	bombs = 99
	allowFlags = true
	activateOnMouseDown = false
	fieldSize = 20

	currentCategory() {
		return `${this.width}-${this.height}-${this.bombs}-${this.allowFlags ? "f" : "n"}`
	}

	triggerNewGame() {
		if (this.gameComponent.game.state.playState !== PlayState.Started)
			setTimeout(() => this.gameComponent.startGame(), 1)
	}
}
