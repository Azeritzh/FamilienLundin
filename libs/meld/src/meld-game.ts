import { GameRunner, HtmlDisplayProvider } from "@lundin/age"
import * as defaultDisplayConfig from "./display-config.json"
import { readDisplayConfig } from "./display/display-config"
import * as gameConfig from "./game-config.json"
import { Meld } from "./meld"
import { MeldConfig } from "./config/meld-config"
import { MeldDisplay } from "./meld-display"
import { GenerateAction, MeldAction } from "./state/meld-action"

export const updatesPerSecond = 30

export class MeldGame extends GameRunner<MeldAction> {
	constructor(
		hostElement: HTMLElement,
		private meldDisplay: MeldDisplay,
		private displayProvider: HtmlDisplayProvider,
		game: Meld,
		private resizeObserver = new ResizeObserver(() => this.setSize(hostElement.clientWidth, hostElement.clientHeight)),
	) {
		super(meldDisplay, game, updatesPerSecond)
		this.resizeObserver.observe(hostElement)
		this.actions.push(new GenerateAction())
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		displayConfig = { ...readDisplayConfig(defaultDisplayConfig), ...displayConfig }
		const meld = new Meld(MeldConfig.read(gameConfig))
		const displayProvider = new HtmlDisplayProvider(hostElement, displayConfig)
		const display = new MeldDisplay(displayConfig, meld, displayProvider)
		return new MeldGame(hostElement, display, displayProvider, meld)
	}

	setSize(width: number, height: number) {
		this.meldDisplay.setSize(width, height)
		this.displayProvider.setSize(width, height)
	}

	onDestroy() {
		this.resizeObserver.disconnect()
	}
}