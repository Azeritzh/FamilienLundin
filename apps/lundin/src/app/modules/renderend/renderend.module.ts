import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { RenderendGameComponent } from "./renderend-game/renderend-game.component"
import { RenderendComponent } from "./renderend.component"

@NgModule({
	declarations: [
		RenderendComponent,
		RenderendGameComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class RenderendModule { }
