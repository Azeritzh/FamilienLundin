import { BaseDisplay, finishTiming, HtmlDisplayProvider, startTiming } from "@lundin/age"
import { Camera } from "./services/camera"
import { DisplayConfig } from "./state/display-config"
import { DisplayEntityDrawer } from "./display-entity-drawer"
import { DisplayState } from "./state/display-state"
import { DashDrawer } from "./entity/dash-drawer"
import { StandardEntityDrawer } from "./entity/standard-entity-drawer"
import { HudDrawer } from "./hud/hud-drawer"
import { InputParser } from "./services/input-parser"
import { TerrainDrawer } from "./terrain/terrain-drawer"
import { EntitiesDrawer } from "./entity/entities-drawer"
import { Meld } from "../meld"
import { GameUpdate } from "../state/game-update"
import { Visibility } from "./services/visibility"
import { TileDrawer } from "./terrain/tile-drawer"
import { WallDrawer } from "./terrain/wall-drawer"
import { BorderDrawer } from "./terrain/border-drawer"
import { BlockShadowDrawer } from "./terrain/block-shadow-drawer"

export class MeldDisplay implements BaseDisplay<GameUpdate> {
	constructor(
		private Config: DisplayConfig,
		private Game: Meld,
		private Display: HtmlDisplayProvider,
		PlayerName: string,
		private State = DisplayState.from(Config, PlayerName),
		private camera = new Camera(Game, Display, Config, State),
		private visibility = new Visibility(Game, Config, State, camera),
		private inputParser = new InputParser(Game, State, camera, visibility, Display, Config.Inputs),
		private displayEntityDrawer = new DisplayEntityDrawer(Game, Config, State, camera),
		private hudDrawer = new HudDrawer(Game, Config, State, Display),

		private tileDrawer = new TileDrawer(Config, State, camera, Game),
		private wallDrawer = new WallDrawer(Config, State, camera),
		private borderDrawer = new BorderDrawer(Config, camera),
		private blockShadowDrawer = new BlockShadowDrawer(Config, camera, Game),
		private terrainDrawer = new TerrainDrawer(Game, Config, State, camera, [tileDrawer, wallDrawer, borderDrawer, blockShadowDrawer]),

		private entityDrawer = new StandardEntityDrawer(Game, Config, camera),
		private dashDrawer = new DashDrawer(Game, Config, State, camera, displayEntityDrawer),
		private entitiesDrawer = new EntitiesDrawer(Game, State, [entityDrawer, dashDrawer]),
	) {
		Game.dashLogic.Listeners.push(dashDrawer)
		Display.sortByDepth = true
	}

	setSize(width: number, height: number) {
		this.State.Size.updateHostSize(width, height)
		this.visibility.UpdateSize()
	}

	show(fractionOfTick = 0) {
		this.Display.startFrame()
		startTiming("displayUpdate")
		this.State.FractionOfTick = fractionOfTick
		const firstEntity = [...this.Game.Entities.With.Position.keys()][0]
		if (firstEntity !== undefined && firstEntity !== null) {
			this.camera.FocusOn(firstEntity)
			this.visibility.Update()
		}
		this.entitiesDrawer.Draw()
		this.terrainDrawer.Draw()
		this.displayEntityDrawer.DrawDisplayEntities()
		this.hudDrawer.Draw()
		finishTiming("displayUpdate")
		this.Display.endFrame()
	}

	getNewActions() {
		return this.inputParser.ParseInputs()
	}
}
