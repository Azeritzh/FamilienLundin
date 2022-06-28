import { GameRunner, HtmlDisplayProvider } from "@lundin/age"
import { RenderendConfig } from "./config/renderend-config"
import * as defaultDisplayConfig from "./display-config.json"
import { readDisplayConfig } from "./display/display-config"
import * as gameConfig from "./game-config.json"
import { Renderend } from "./renderend"
import { RenderendDisplay } from "./renderend-display"
import { RenderendAction, StartGameAction } from "./state/renderend-action"

export const updatesPerSecond = 30

export class RenderendGame extends GameRunner<RenderendAction> {
	constructor(
		hostElement: HTMLElement,
		private renderendDisplay: RenderendDisplay,
		private displayProvider: HtmlDisplayProvider,
		game: Renderend,
		private resizeObserver = new ResizeObserver(() => this.setSize(hostElement.clientWidth, hostElement.clientHeight)),
	) {
		super(renderendDisplay, game, updatesPerSecond)
		this.resizeObserver.observe(hostElement)
		this.actions.push(new StartGameAction)
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		displayConfig = { ...readDisplayConfig(defaultDisplayConfig), ...displayConfig }
		const renderend = new Renderend(RenderendConfig.read(gameConfig))
		const displayProvider = new HtmlDisplayProvider(hostElement, displayConfig)
		const display = new RenderendDisplay(displayConfig, renderend, displayProvider)
		return new RenderendGame(hostElement, display, displayProvider, renderend)
	}

	setSize(width: number, height: number) {
		this.renderendDisplay.setSize(width, height)
		this.displayProvider.setSize(width, height)
	}

	onDestroy() {
		this.resizeObserver.disconnect()
	}
}
