import { BaseDisplay, finishTiming, HtmlDisplayProvider, startTiming } from "@lundin/age"
import { Meld } from "../meld"
import { GameUpdate } from "../state/game-update"
import { DisplayEntityDrawer } from "./display-entity-drawer"
import { DashDrawer } from "./entity/dash-drawer"
import { EntityDisplay } from "./entity/entity-display"
import { EntityShadowDrawer } from "./entity/entity-shadow-drawer"
import { StandardEntityDrawer } from "./entity/standard-entity-drawer"
import { BlockMarkerDrawer } from "./hud/block-marker-drawer"
import { HudDrawer } from "./hud/hud-drawer"
import { UiDisplay } from "./hud/ui-display"
import { Camera } from "./services/camera"
import { InputParser } from "./services/input-parser"
import { Visibility } from "./services/visibility"
import { DisplayConfig } from "./state/display-config"
import { DisplaySettings } from "./state/display-settings"
import { DisplayState } from "./state/display-state"
import { BlockShadowDrawer } from "./terrain/block-shadow-drawer"
import { BorderDrawer } from "./terrain/border-drawer"
import { TerrainDrawer } from "./terrain/terrain-drawer"
import { TileDrawer } from "./terrain/tile-drawer"
import { WallDrawer } from "./terrain/wall-drawer"
import { HammerDrawer } from "./entity/hammer-drawer"

export class MeldDisplay implements BaseDisplay<GameUpdate> {
	constructor(
		public Config: DisplayConfig,
		private Settings: DisplaySettings,
		private Game: Meld,
		private Display: HtmlDisplayProvider,
		PlayerName: string,
		private State = DisplayState.from(Config, PlayerName),
		private camera = new Camera(Game, Display, Config, State),
		private visibility = new Visibility(Game, Config, State, camera),
		private inputParser = new InputParser(Game, State, camera, visibility, Display, Settings.Inputs),
		private displayEntityDrawer = new DisplayEntityDrawer(Game, Config, State, camera),

		hudDrawer = new HudDrawer(Game, Config, State, Display),
		blockMarkerDrawer  = new BlockMarkerDrawer(Game, Config, State, camera),
		private uiDisplay = new UiDisplay(Game, State, [hudDrawer, blockMarkerDrawer]),

		tileDrawer = new TileDrawer(Config, State, camera, Game),
		wallDrawer = new WallDrawer(Config, State, camera),
		borderDrawer = new BorderDrawer(Config, camera),
		blockShadowDrawer = new BlockShadowDrawer(Config, camera, Game),
		private terrainDrawer = new TerrainDrawer(Game, Config, State, camera, [tileDrawer, wallDrawer, borderDrawer, blockShadowDrawer]),

		entityDrawer = new StandardEntityDrawer(Game, Config, camera),
		entityShadowDrawer = new EntityShadowDrawer(Game, Config, camera),
		dashDrawer = new DashDrawer(Game, Config, State, camera, displayEntityDrawer),
		hammerDrawer = new HammerDrawer(Game, Config, camera),
		private entitiesDrawer = new EntityDisplay(Game, Config, State, [entityDrawer, entityShadowDrawer, dashDrawer, hammerDrawer]),
	) {
		Game.dashLogic.Listeners.push(dashDrawer)
		Display.SortByDepth = true
	}

	setSize(width: number, height: number) {
		this.State.Size.UpdateHostSize(width, height)
		this.visibility.UpdateSize()
	}

	show(fractionOfTick = 0) {
		this.Display.StartNewFrame()
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
		this.uiDisplay.Draw()
		finishTiming("displayUpdate")
		this.Display.FinishFrame()
	}

	getNewActions() {
		return this.inputParser.GetNewActions()
	}
}
