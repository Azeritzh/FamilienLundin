import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { MediaComponent } from "./media.component"
import { MusicComponent } from "./music.component"

@NgModule({
	declarations: [
		MediaComponent,
		MusicComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutingModule,
	],
	providers: [],
})
export class MediaModule { }
