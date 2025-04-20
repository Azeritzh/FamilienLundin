import { Component, HostListener, Input } from "@angular/core"
import { MusicService, Track } from "./music.service"

@Component({
	selector: "lundin-track",
	templateUrl: "./track.component.html",
	styleUrls: ["./track.component.scss"],
})
export class TrackComponent {
	@Input() track: Track
	@Input() fields: string[] = ["title", "artists", "album", "albumArtist"]
	active = false

	constructor(
		public musicService: MusicService
	) { }

	@HostListener("click")
	click() {
		this.active = !this.active
	}
}
