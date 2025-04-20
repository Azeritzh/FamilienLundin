import { Component, Input } from "@angular/core"
import { MusicService, Track } from "./music.service"

@Component({
	selector: "lundin-tracklist",
	templateUrl: "./tracklist.component.html",
	styleUrls: ["./tracklist.component.scss"],
})
export class TrackListComponent {
	@Input() tracks: Track[] = []
	@Input() isQueue = false

	constructor(
		public musicService: MusicService
	) { }
}