import { BaseDisplay, finishTiming, HtmlDisplayProvider, startTiming } from "@lundin/age"
import { Camera } from "./display/camera"
import { DisplayConfig } from "./display/display-config"
import { DisplayEntityDrawer } from "./display/display-entity-drawer"
import { DisplayState } from "./display/display-state"
import { DashDrawer } from "./display/entity-drawers/dash-drawer"
import { StandardEntityDrawer } from "./display/entity-drawers/standard-entity-drawer"
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
		private displayEntityDrawer = new DisplayEntityDrawer(Game, Config, State, camera),
		private terrainDrawer = new TerrainDrawer(Game, Config, State, camera),
		private entityDrawer = new StandardEntityDrawer(Game, Config, camera),
		private dashDrawer = new DashDrawer(Game, Config, State, camera, displayEntityDrawer),
		private worldDrawer = new WorldDrawer(Game, Config, camera, terrainDrawer, [entityDrawer, dashDrawer]),
		private hudDrawer = new HudDrawer(Game, Config, State, Display),
	) {
		Game.dashLogic.Listeners.push(dashDrawer)
		Display.sortByDepth = true
	}

	setSize(width: number, height: number) {
		this.State.Size.updateHostSize(width, height)
	}

	show(fractionOfTick = 0) {
		this.State.FractionOfTick = fractionOfTick
		const firstEntity = [...this.Game.Entities.With.Position.keys()][0]
		if (firstEntity !== undefined && firstEntity !== null)
			this.camera.FocusOn(firstEntity)
		this.Display.startFrame()
		startTiming("displayUpdate")
		this.worldDrawer.DrawWorld()
		this.displayEntityDrawer.DrawDisplayEntities()
		this.hudDrawer.Draw()
		finishTiming("displayUpdate")
		this.Display.endFrame()
	}

	getNewActions() {
		return this.inputParser.ParseInputs()
	}
}
