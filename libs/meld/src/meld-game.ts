import { GameRunner, HtmlDisplayProvider } from "@lundin/age"
import * as defaultDisplayConfig from "./display-config.json"
import * as gameConfig from "./game-config.json"
import { Meld } from "./meld"
import { MeldDisplay } from "./display/meld-display"
import { readDisplayConfig } from "./serialisation/serialisation-display-config"
import { readGameConfig } from "./serialisation/serialisation-game-config"
import { createGameState, readGameState } from "./serialisation/serialisation-game-state"
import { GenerateAction, GameUpdate, LoadState } from "./state/game-update"

export const updatesPerSecond = 30

export class MeldGame extends GameRunner<GameUpdate> {
	constructor(
		hostElement: HTMLElement,
		private meldDisplay: MeldDisplay,
		private displayProvider: HtmlDisplayProvider,
		private meld: Meld,
		private resizeObserver = new ResizeObserver(() => this.setSize(hostElement.clientWidth, hostElement.clientHeight)),
	) {
		super(meldDisplay, meld, updatesPerSecond)
		this.resizeObserver.observe(hostElement)
		const saved = localStorage["meld-save-0.3"]
		if (saved)
			this.actions.push(new LoadState(readGameState(meld.Config, JSON.parse(saved))))
		else
			this.actions.push(new GenerateAction())
		window.addEventListener("unload", this.onUnload)
		this.afterGameUpdate = () => this.displayProvider.endInputFrame()
	}

	private onUnload = () => {
		this.saveGame()
	}

	private saveGame() {
		const saved = createGameState(this.meld.Config, this.meld.State)
		localStorage["meld-save-0.3"] = JSON.stringify(saved)
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		const meld = new Meld(readGameConfig(gameConfig))
		displayConfig = { ...readDisplayConfig(meld.Config, defaultDisplayConfig), ...displayConfig }
		const displayProvider = new HtmlDisplayProvider(hostElement, displayConfig)
		const display = new MeldDisplay(displayConfig, meld, displayProvider, "insertPlayerName")
		return new MeldGame(hostElement, display, displayProvider, meld)
	}

	setSize(width: number, height: number) {
		this.meldDisplay.setSize(width, height)
		this.displayProvider.setSize(width, height)
	}

	onDestroy() {
		super.onDestroy()
		this.resizeObserver.disconnect()
		window.removeEventListener("visibilitychanged", this.onUnload)
		this.saveGame()
	}
}
