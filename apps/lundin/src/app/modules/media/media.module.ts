import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { AlbumsComponent } from "./albums.component"
import { MusicComponent } from "./music.component"
import { MusicService } from "./music.service"
import { PlaylistSelectorComponent } from "./playlist-selector.component"
import { PlaylistService } from "./playlist.service"
import { PlaylistsComponent } from "./playlists.component"
import { TrackComponent } from "./track.component"
import { TrackListComponent } from "./tracklist.component"
import { VideoComponent } from "./video.component"

@NgModule({
	declarations: [
		AlbumsComponent,
		MusicComponent,
		PlaylistsComponent,
		PlaylistSelectorComponent,
		TrackComponent,
		TrackListComponent,
		VideoComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutingModule,
	],
	providers: [
		MusicService,
		PlaylistService,
	],
})
export class MediaModule { }
