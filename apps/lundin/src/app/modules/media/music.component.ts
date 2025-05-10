import { CommonModule } from "@angular/common"
import { Component, ElementRef, ViewChild } from "@angular/core"
import { AlbumsComponent } from "./albums.component"
import { MusicService } from "./music.service"
import { PlaylistsComponent } from "./playlists.component"
import { TrackListComponent } from "./tracklist.component"
import { AudioPlayerComponent } from "./audio-player.component"

@Component({
	selector: "lundin-music",
	templateUrl: "./music.component.html",
	styleUrls: ["./music.component.scss"],
	imports: [
		CommonModule,
		AlbumsComponent,
		PlaylistsComponent,
		TrackListComponent,
		AudioPlayerComponent,
	],
})
export class MusicComponent {
	@ViewChild("audioPlayer") audioPlayer!: ElementRef<HTMLAudioElement>
	musicLibrary: any[] = []
	currentTab: "library" | "album" | "playlist" | "current" = "library"

	constructor(
		public musicService: MusicService
	) { }

	selectTab(tab: "library" | "album" | "playlist" | "current") {
		this.currentTab = tab
	}
}
