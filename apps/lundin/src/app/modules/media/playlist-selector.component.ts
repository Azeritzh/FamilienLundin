import { Component, EventEmitter, Output } from "@angular/core"
import { PlaylistService } from "./playlist.service"
import { MusicPlaylist } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-playlist-selector",
	templateUrl: "./playlist-selector.component.html",
	styleUrls: ["./playlist-selector.component.scss", "../../styles/popup-box.scss"],
})
export class PlaylistSelectorComponent {
	playlists: MusicPlaylist[] = []
	newPlaylistName = ""
	@Output() selectedPlaylist = new EventEmitter<MusicPlaylist>()

	constructor(
		private playlistService: PlaylistService,
	) {
		this.playlistService.getPlaylists().then(playlists => {
			this.playlists = playlists
		})
	}

	createPlaylist() {
		this.selectedPlaylist.emit({
			_id: null,
			userId: null,
			title: this.newPlaylistName,
			shared: false,
			content: [],
		})
	}

	selectPlaylist(playlist: MusicPlaylist) {
		this.selectedPlaylist.emit(playlist)
	}
}