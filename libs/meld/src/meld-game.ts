import { GameRunner, HtmlDisplayProvider, Id, TypeMap } from "@lundin/age"
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
		const defaultDisplayConfig = {
			renderToVirtualSize: false,
			virtualHeight: 160,
			virtualPixelsPerTile: 16,
			assetFolder: "assets/",
			sprites: {
				"tile-dirt": {
					path: "tile-dirt",
					width: 16,
					height: 16,
				},
				"tile-earth": {
					path: "tile-earth",
					width: 16,
					height: 16,
				},
				"tile-grass": {
					path: "tile-grass",
					width: 16,
					height: 16,
				},
				"tile-slab": {
					path: "tile-slab",
					width: 16,
					height: 16,
				},
				"tile-stone": {
					path: "tile-stone",
					width: 16,
					height: 16,
				},
				"tile-wooden": {
					path: "tile-wooden",
					width: 16,
					height: 16,
				},
			},
		}
		displayConfig = { ...defaultDisplayConfig, ...displayConfig }
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
