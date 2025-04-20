import { Component } from "@angular/core"
import { Subscription } from "rxjs"
import { Album, MusicService } from "./music.service"

@Component({
	selector: "lundin-albums",
	templateUrl: "./albums.component.html",
	styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent {
	subscription: Subscription | null
	albums: DecoratedAlbum[] = []
	currentAlbum: DecoratedAlbum | null = null

	constructor(
		private musicService: MusicService,
	) {
		this.subscription = this.musicService.loaded$.subscribe(() => {
			this.albums = Object.entries(this.musicService.musicLibrary).map(([folder, album]) => ({ ...album, cover: folder + "/cover.jpg" }))
		})
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	selectAlbum(album: DecoratedAlbum) {
		this.currentAlbum = album
	}

	addCurrentAlbum() {
		this.musicService.addAsLast(...this.currentAlbum.tracks.map(x => x.identifier))
	}
}

type DecoratedAlbum = Album & { cover: string }