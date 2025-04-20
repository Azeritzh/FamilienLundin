import { Component } from "@angular/core"
import { Album, MusicService } from "./music.service"
import { Subscription } from "rxjs"

@Component({
	selector: "lundin-albums",
	templateUrl: "./albums.component.html",
	styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent {
	albums: (Album & { cover: string })[] = []
	subscription: Subscription | null

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
}