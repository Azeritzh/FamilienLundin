import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { MusicPlaylist } from "@lundin/api-interfaces"
import { AuthService } from "../../services/auth.service"
import { PlaylistService } from "./playlist.service"

@Component({
	selector: "lundin-playlist-selector",
	templateUrl: "./playlist-selector.component.html",
	styleUrls: ["./playlist-selector.component.scss", "../../styles/popup-box.scss"],
	imports: [
		CommonModule,
		FormsModule,
	],
})
export class PlaylistSelectorComponent {
	playlists: MusicPlaylist[] = []
	newPlaylistName = ""
	@Output() selectedPlaylist = new EventEmitter<MusicPlaylist>()

	constructor(
		private playlistService: PlaylistService,
		private authService: AuthService,
	) {
		this.playlistService.getPlaylists().then(playlists => {
			this.playlists = playlists.filter(x => x.userId === this.authService.loginInfo?.userId && Array.isArray(x.content))
		})
	}

	createPlaylist() {
		this.selectedPlaylist.emit({
			_id: null!,
			userId: null!,
			title: this.newPlaylistName,
			shared: true,
			content: [],
		})
	}

	selectPlaylist(playlist: MusicPlaylist) {
		this.selectedPlaylist.emit(playlist)
	}
}