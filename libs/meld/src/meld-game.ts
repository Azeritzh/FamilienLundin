import { GameRunner, HtmlDisplayProvider, Id, TypeMap } from "@lundin/age"
import * as defaultDisplayConfig from "./display-config.json"
import { readDisplayConfig } from "./display/display-config"
import { Meld } from "./meld"
import { MeldConfig } from "./meld-config"
import { MeldConstants } from "./meld-constants"
import { MeldDisplay } from "./meld-display"
import { BlockValues } from "./state/block-values"
import { GroupedEntityValues } from "./state/entity-values"
import { GenerateAction, MeldAction } from "./state/meld-action"

export class MeldGame extends GameRunner<MeldAction> {
	constructor(
		hostElement: HTMLElement,
		private meldDisplay: MeldDisplay,
		private displayProvider: HtmlDisplayProvider,
		game: Meld,
		updatesPerSecond = 60,
		private resizeObserver = new ResizeObserver(() => this.setSize(hostElement.clientWidth, hostElement.clientHeight)),
	) {
		super(meldDisplay, game, updatesPerSecond)
		this.resizeObserver.observe(hostElement)
		this.actions.push(new GenerateAction())
	}

	static createAt(hostElement: HTMLElement, displayConfig: any) {
		displayConfig = { ...readDisplayConfig(defaultDisplayConfig), ...displayConfig }
		//const meld = new Meld(MeldConfig.read(gameConfig))
		const meld = new Meld(new MeldConfig(new MeldConstants(), TypeMap.from(["tile-dirt", "tile-earth", "tile-grass", "tile-slab", "tile-stone", "tile-wooden"]), new Map<Id, GroupedEntityValues>(), new Map<Id, BlockValues>()))
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
