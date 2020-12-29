import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MinestrygerGameComponent } from "./minestryger-game/minestryger-game.component"
import { MinestrygerHighscoresComponent } from "./minestryger-highscores/minestryger-highscores.component"
import { MinestrygerSettingsComponent } from "./minestryger-settings/minestryger-settings.component"
import { MinestrygerComponent } from "./minestryger.component"
import { MinestrygerService } from "./minestryger.service"

@NgModule({
	declarations: [
		MinestrygerComponent,
		MinestrygerGameComponent,
		MinestrygerHighscoresComponent,
		MinestrygerSettingsComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [MinestrygerService],
})
export class MinestrygerModule { }
