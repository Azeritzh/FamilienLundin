import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { defaultDisplayConfig, FlagAction, Minestryger, MinestrygerAction, MinestrygerDisplay, MinestrygerInput, PlayState, RevealAction, RevealAreaAction } from "@lundin/minestryger"
import { NavigationService } from "../../services/navigation.service"
import { MinestrygerService } from "./minestryger.service"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent implements OnInit, OnDestroy {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	private game: Minestryger
	private display: MinestrygerDisplay
	private input: MinestrygerInput

	private enableRegistering = true

	constructor(
		private minestrygerService: MinestrygerService,
		private navigationService: NavigationService,
	) { }

	ngOnInit() {
		this.game = new Minestryger()
		this.display = new MinestrygerDisplay(this.game, this.gameHost.nativeElement, { ...defaultDisplayConfig, newGameText: "Nyt spil" })
		this.input = new MinestrygerInput(this.game, this.display, this.startNewGame, this.onAction)
		new ResizeObserver(() => { this.display.updateSize() }).observe(this.gameHost.nativeElement)
		this.display.show()
		this.exposeGame()
	}

	ngOnDestroy() {
		this.display.onDestroy()
	}

	private startNewGame = () => {
		this.game = new Minestryger(this.display.state.desiredConfig)
		this.display.updateGame(this.game)
		this.input.game = this.game
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

	currentCategory() {
		return `${this.game.config.width}-${this.game.config.height}-${this.game.config.bombs}-${this.game.config.allowFlags ? "f" : "n"}`
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

	private exposeGame = () => {
		const exposed: any = {}
		window["minestryger"] = exposed
		exposed.game = this.game
		exposed.board = this.game.state.board
		exposed.startNewGame = (width?: number, height?: number, bombs?: number) => {
			if (width !== null && width !== undefined)
				this.display.state.desiredConfig.width = width
			if (height !== null && height !== undefined)
				this.display.state.desiredConfig.height = height
			if (bombs !== null && bombs !== undefined)
				this.display.state.desiredConfig.bombs = bombs
			this.startNewGame()
		}
		exposed.revealField = (x: number, y: number) => {
			this.enableRegistering = false
			this.onAction(new RevealAction(x, y))
		}
		exposed.flagField = (x: number, y: number) => {
			this.enableRegistering = false
			this.onAction(new FlagAction(x, y))
		}
		exposed.revealSurroundings = (x: number, y: number) => {
			this.enableRegistering = false
			this.onAction(new RevealAreaAction(x, y))
		}
		exposed.hasWon = () => this.game.state.playState === PlayState.Won
		exposed.hasLost = () => this.game.state.playState === PlayState.Lost
	}

}
