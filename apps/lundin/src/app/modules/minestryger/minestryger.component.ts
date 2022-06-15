import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { Minestryger, MinestrygerDisplay, PlayState } from "@lundin/minestryger"
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

	ngOnInit(){
		const game = new Minestryger()
		const display = new MinestrygerDisplay(game, this.gameHost.nativeElement)
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
