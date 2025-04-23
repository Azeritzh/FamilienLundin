import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core"
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
		private changeDetectorRef: ChangeDetectorRef,
		public musicService: MusicService,
		private playlistService: PlaylistService,
	) {
		this.playlistService.getPlaylists().then(x => {
			this.playlists = x
			this.changeDetectorRef.markForCheck()
		})
	}

	selectPlaylist(playlist: MusicPlaylist) {
		this.currentPlaylist = playlist
	}

	removeFromPlaylist(track: Track) {
		if (!Array.isArray(this.currentPlaylist.content))
			return
		const index = this.currentPlaylist.content.indexOf(track.identifier)
		if (index === -1)
			return
		this.currentPlaylist.content.splice(index, 1)
		this.playlistService.updatePlaylist(this.currentPlaylist)
		this.playlistTracks.delete(this.currentPlaylist)
	}

	tracksFor(playlist: MusicPlaylist) {
		if (!this.playlistTracks.has(playlist)) {
			if (Array.isArray(playlist.content))
				this.playlistTracks.set(playlist, playlist.content.map(x => this.musicService.trackFor(x)))
			else
				this.playlistTracks.set(playlist, []) // TODO
		}
		return this.playlistTracks.get(playlist)
	}
}
