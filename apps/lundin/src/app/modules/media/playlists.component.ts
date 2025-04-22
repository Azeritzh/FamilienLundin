import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core"
import { MusicPlaylist } from "@lundin/api-interfaces"
import { Subscription } from "rxjs"
import { MusicService } from "./music.service"

@Component({
	selector: "lundin-playlists",
	templateUrl: "./playlists.component.html",
	styleUrls: ["./playlists.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistsComponent implements OnDestroy {
	subscriptions: { [index: string]: Subscription } = {}
	playlists: MusicPlaylist[] = [{
		_id: 1,
		userId: 1,
		title: "Listliste",
		shared: true,
		content: [
			"ABBA/ABBA|SOS",
			"ABBA/ABBA|Rock Me",
			"ABBA/ABBA|So Long",
		],
	}]
	currentPlaylist: MusicPlaylist | null = null

	constructor(
		private musicService: MusicService,
	) {
		this.subscriptions["loaded"] = this.musicService.loaded$.subscribe(() => {
			//this.albums = Object.entries(this.musicService.musicLibrary).map(([folder, album]) => ({ ...album, cover: folder + "/cover.jpg" }))
		})
	}

	ngOnDestroy() {
		for (const sub of Object.values(this.subscriptions))
			sub.unsubscribe()
	}

	selectPlaylist(playlist: MusicPlaylist) {
		this.currentPlaylist = playlist
	}

	addCurrentPlaylist() {
		//this.musicService.addAsLast(...this.currentPlaylist.tracks.map(x => x.identifier))
	}

	tracksFor(playlist: MusicPlaylist) {
		if (Array.isArray(playlist.content))
			return playlist.content.map(x => this.musicService.trackFor(x))
		else
			return []
	}
}
