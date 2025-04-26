import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
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
		CommonModule,
		SharedModule,
	],
	providers: [],
})
export class VirusModule { }
