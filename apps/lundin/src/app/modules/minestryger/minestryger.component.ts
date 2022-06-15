import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { Minestryger, MinestrygerAction, MinestrygerConfig, MinestrygerDisplay, MinestrygerInput, PlayState } from "@lundin/minestryger"
import { NavigationService } from "../../services/navigation.service"
import { MinestrygerGameComponent } from "./minestryger-game/minestryger-game.component"
import { MinestrygerService } from "./minestryger.service"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	@ViewChild(MinestrygerGameComponent) gameComponent: MinestrygerGameComponent
	private game: Minestryger
	private display: MinestrygerDisplay
	private input: MinestrygerInput

	width = 30
	height = 16
	bombs = 99
	allowFlags = true
	set activateOnMouseDown(value: boolean){
		this.input.activateOnMouseDown = value
	}
	get activateOnMouseDown(){
		return this.input.activateOnMouseDown
	}
	fieldSize = 20
	autoSize = true
	private enableRegistering = true

	constructor(
		private minestrygerService: MinestrygerService,
		private navigationService: NavigationService,
	) { }

	ngOnInit() {
		this.game = new Minestryger()
		this.display = new MinestrygerDisplay(this.game, this.gameHost.nativeElement, "Nyt spil")
		this.input = new MinestrygerInput(this.game, this.display, this.startNewGame, this.onAction)
		new ResizeObserver(this.updateSize).observe(this.gameHost.nativeElement)
		this.display.show()
	}

	private startNewGame = () => {
		const config = new MinestrygerConfig(
			this.width,
			this.height,
			this.bombs,
			this.allowFlags,
		)
		this.game = new Minestryger(config)
		this.display.game = this.game
		this.input.game = this.game
		this.updateSize()
		this.navigationService.closeMessage()
	}

	private onAction = (action: MinestrygerAction) => {
		const oldState = this.game.state.playState
		this.game.update(action)
		const newState = this.game.state.playState
		if (newState === PlayState.Won && oldState !== PlayState.Won)
			this.registerScore()
		this.display.show()
	}

	updateSize = () => {
		if (this.autoSize)
			this.display.setSize(this.gameHost.nativeElement.clientWidth, this.gameHost.nativeElement.clientHeight)
		else
			this.display.setFieldSize(this.fieldSize)
		this.display.show()
	}

	currentCategory() {
		return `${this.width}-${this.height}-${this.bombs}-${this.allowFlags ? "f" : "n"}`
	}

	triggerNewGame() {
		if (this.gameComponent.game.state.playState !== PlayState.Started)
			setTimeout(() => this.gameComponent.startGame(), 1)
		if (this.game.state.playState !== PlayState.Started)
			setTimeout(() => this.startNewGame(), 1)
	}

	triggerRedraw() {
		setTimeout(() => {
			this.gameComponent.resetCanvas()
			this.gameComponent.drawEverything()
			this.updateSize()
		}, 1)
	}

	private registerScore() {
		const score = {
			time: this.game.state.finishTime,
			date: new Date().toISOString(),
			type: `${this.game.config.width}-${this.game.config.height}-${this.game.config.bombs}-${this.game.state.hasUsedFlags ? "f" : "n"}`,
		}
		if (this.enableRegistering)
			this.minestrygerService.registerScore(score)
		const time = (this.game.state.finishTime / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 })
		this.navigationService.showMessage(`Du har vundet! Endelig tid: ${time} sekunder`)
	}
}
