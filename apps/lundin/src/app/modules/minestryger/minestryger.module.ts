import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MinestrygerGameComponent } from "./minestryger-game/minestryger-game.component"
import { MinestrygerComponent } from "./minestryger.component"

@NgModule({
	declarations: [MinestrygerComponent, MinestrygerGameComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class MinestrygerModule { }