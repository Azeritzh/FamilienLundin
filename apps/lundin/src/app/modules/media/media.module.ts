import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { AlbumComponent } from "./album.component"
import { AlbumsComponent } from "./albums.component"
import { MusicComponent } from "./music.component"
import { MusicService } from "./music.service"
import { TrackComponent } from "./track.component"
import { VideoComponent } from "./video.component"

@NgModule({
	declarations: [
		AlbumComponent,
		AlbumsComponent,
		MusicComponent,
		TrackComponent,
		VideoComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutingModule,
	],
	providers: [
		MusicService,
	],
})
export class MediaModule { }
