import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { MusicComponent } from "./music.component"
import { VideoComponent } from "./video.component"

@NgModule({
	declarations: [
		MusicComponent,
		VideoComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutingModule,
	],
	providers: [],
})
export class MediaModule { }
