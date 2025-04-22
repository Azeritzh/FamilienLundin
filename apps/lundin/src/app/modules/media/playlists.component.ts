import { ChangeDetectionStrategy, Component } from "@angular/core"
import { MusicPlaylist } from "@lundin/api-interfaces"
import { MusicService, Track } from "./music.service"
import { PlaylistService } from "./playlist.service"

@Component({
	selector: "lundin-playlists",
	templateUrl: "./playlists.component.html",
	styleUrls: ["./playlists.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistsComponent {
	playlistTracks = new Map<MusicPlaylist, Track[]>()
	playlists: MusicPlaylist[] = []
	currentPlaylist: MusicPlaylist | null = null

	constructor(
		public musicService: MusicService,
		private playlistService: PlaylistService,
	) {
		this.playlistService.getPlaylists().then(x => this.playlists = x)
	}

	selectPlaylist(playlist: MusicPlaylist) {
		this.currentPlaylist = playlist
	}

	addCurrentPlaylist() {
		//this.musicService.addAsLast(...this.currentPlaylist.tracks.map(x => x.identifier))
	}

	tracksFor(playlist: MusicPlaylist) {
		if (!this.playlistTracks.has(playlist)) {
			if (Array.isArray(playlist.content))
				this.playlistTracks.set(playlist, playlist.content.map(x => this.musicService.trackFor(x)))
			else
				this.playlistTracks.set(playlist, [])
		}
		return this.playlistTracks.get(playlist)
	}
}
