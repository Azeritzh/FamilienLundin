import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { Minestryger, MinestrygerDisplay, MinestrygerInput, PlayState } from "@lundin/minestryger"
import { MinestrygerGameComponent } from "./minestryger-game/minestryger-game.component"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	@ViewChild(MinestrygerGameComponent) gameComponent: MinestrygerGameComponent
	width = 30
	height = 16
	bombs = 99
	allowFlags = true
	activateOnMouseDown = false
	fieldSize = 20
	autoSize = true

	ngOnInit() {
		let game = new Minestryger()
		const display = new MinestrygerDisplay(game, this.gameHost.nativeElement)
		const startNewGame = () => {
			game = new Minestryger()
			display.game = game
			input.game = game
			display.show()
		}
		const input = new MinestrygerInput(game, display, startNewGame, action => {
			game.update(action)
			display.show()
		})
		display.show()
	}

	currentCategory() {
		return `${this.width}-${this.height}-${this.bombs}-${this.allowFlags ? "f" : "n"}`
	}

	triggerNewGame() {
		if (this.gameComponent.game.state.playState !== PlayState.Started)
			setTimeout(() => this.gameComponent.startGame(), 1)
	}

	triggerRedraw() {
		setTimeout(() => {
			this.gameComponent.resetCanvas()
			this.gameComponent.drawEverything()
		}, 1)
	}
}
