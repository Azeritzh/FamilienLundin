import { GameRunner, HtmlDisplayProvider } from "@lundin/age"
import * as defaultDisplayConfig from "./display-config.json"
import * as defaultDisplaySettings from "./display-settings.json"
import { MeldDisplay } from "./display/meld-display"
import * as gameConfig from "./game-config.json"
import { DummyVariationProvider, RegionGenerator } from "./generation/region-generator"
import { Meld } from "./meld"
import { readDisplayConfig } from "./serialisation/serialisation-display-config"
import { readDisplaySettings } from "./serialisation/serialisation-display-settings"
import { readGameConfig } from "./serialisation/serialisation-game-config"
import { readGameState } from "./serialisation/serialisation-game-state"
import { GameUpdate, LoadPlayer, LoadRegion, LoadState } from "./state/game-update"
import { Vector3 } from "@lundin/utility"

export const updatesPerSecond = 60

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
		const saved = false //localStorage["meld-save-0.4"]
		if (saved)
			this.actions.push(new LoadState(readGameState(meld.Config, JSON.parse(saved))))
		else
			this.actions.push(
				new LoadRegion(new RegionGenerator(meld.Config, new DummyVariationProvider(), new Vector3(0, 0, 0), 0, 0).Generate()),
				new LoadPlayer("insertPlayerName"),
			)
		window.addEventListener("unload", this.onUnload)
		this.afterGameUpdate = () => this.displayProvider.endInputFrame()
	}

	private onUnload = () => {
		this.saveGame()
	}

	private saveGame() {
		//const saved = createGameState(this.meld.Config, this.meld.State)
		//localStorage["meld-save-0.4"] = JSON.stringify(saved)
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		const meld = new Meld(readGameConfig(gameConfig))
		displayConfig = { ...readDisplayConfig(meld.Config, defaultDisplayConfig), ...displayConfig }
		const displaySettings = readDisplaySettings(defaultDisplaySettings)
		const displayProvider = new HtmlDisplayProvider(hostElement, displayConfig)
		const display = new MeldDisplay(displayConfig, displaySettings, meld, displayProvider, "insertPlayerName")
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
