import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { SettingsComponent } from "./settings/settings.component"
import { VirusGameComponent } from "./virus-game/virus-game.component"
import { VirusComponent } from "./virus.component"

@NgModule({
	declarations: [
		SettingsComponent,
		VirusComponent,
		VirusGameComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class VirusModule { }
