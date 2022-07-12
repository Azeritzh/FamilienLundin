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
import { GameUpdate } from "./state/game-update"

export class MeldDisplay implements BaseDisplay<GameUpdate> {
	constructor(
		private Config: DisplayConfig,
		private Game: Meld,
		private Display: HtmlDisplayProvider,
		PlayerName: string,
		private State = DisplayState.from(Config, PlayerName),
		private camera = new Camera(Game, Display, Config, State),
		private inputParser = new InputParser(Game, State, camera, Display, Config.Inputs),
		private terrainDrawer = new TerrainDrawer(Game, Config, State, camera),
		private entityDrawer = new EntityDrawer(Game, camera),
		private worldDrawer = new WorldDrawer(Game, Config, camera, terrainDrawer, entityDrawer),
		private hudDrawer = new HudDrawer(Game, State, Display),
	) {
		Display.sortByDepth = true
	}

	setSize(width: number, height: number) {
		this.State.Size.updateHostSize(width, height)
	}

	show(fractionOfTick = 0) {
		this.State.FractionOfTick = fractionOfTick
		const firstEntity = [...this.Game.Entities.with.Position.keys()][0]
		if (firstEntity !== undefined && firstEntity !== null)
			this.camera.FocusOn(firstEntity)
		this.Display.startFrame()
		//const start = performance.now()
		this.worldDrawer.DrawWorld()
		this.hudDrawer.Draw()
		//console.log(performance.now() - start)
		this.Display.endFrame()
	}

	getNewActions() {
		return this.inputParser.ParseInputs()
	}
}
