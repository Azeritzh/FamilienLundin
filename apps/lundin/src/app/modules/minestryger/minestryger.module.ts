import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MinestrygerHighscoresComponent } from "./minestryger-highscores/minestryger-highscores.component"
import { MinestrygerSettingsComponent } from "./minestryger-settings/minestryger-settings.component"
import { MinestrygerComponent } from "./minestryger.component"
import { MinestrygerService } from "./minestryger.service"

@NgModule({
	declarations: [
		MinestrygerComponent,
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
