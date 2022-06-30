import { BaseDisplay, HtmlDisplayProvider } from "@lundin/age"
import { Camera } from "./display/camera"
import { DisplayConfig } from "./display/display-config"
import { DisplayState } from "./display/display-state"
import { EntityDrawer } from "./display/entity-drawer"
import { HudDrawer } from "./display/hud-drawer"
import { InputParser } from "./display/input-parser"
import { TerrainDrawer } from "./display/terrain-drawer"
import { WorldDrawer } from "./display/world-drawer"
import { Meld } from "./meld"
import { MeldAction } from "./state/meld-action"

export class MeldDisplay implements BaseDisplay<MeldAction> {
	constructor(
		private config: DisplayConfig,
		private game: Meld,
		private display: HtmlDisplayProvider,
		playerName: string,
		private state = DisplayState.from(config, playerName),
		private camera = new Camera(game, display, config, state),
		private inputParser = new InputParser(game, state, camera, display, config.inputs),
		private terrainDrawer = new TerrainDrawer(game, config, camera),
		private entityDrawer = new EntityDrawer(game, camera),
		private worldDrawer = new WorldDrawer(game, config, camera, terrainDrawer, entityDrawer),
		private hudDrawer = new HudDrawer(game, state, display),
	) { }

	setSize(width: number, height: number) {
		this.state.size.updateHostSize(width, height)
	}

	show(fractionOfTick = 0) {
		this.state.fractionOfTick = fractionOfTick
		const firstEntity = [...this.game.entities.with.position.keys()][0]
		this.camera.focusOn(firstEntity)
		this.display.startFrame()
		//const start = performance.now()
		this.worldDrawer.drawWorld()
		this.hudDrawer.draw()
		//console.log(performance.now() - start)
		this.display.endFrame()
	}

	getNewActions() {
		return this.inputParser.parseInputs()
	}
}
