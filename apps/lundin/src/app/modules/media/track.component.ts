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
	@Input() isPlaying = false
	@Input() showQueueButtons = true
	active = false
	collapsed = true

	constructor(
		public musicService: MusicService
	) { }

	@HostListener("click")
	click() {
		if (!this.active) {
			this.active = true
			setTimeout(() => this.collapsed = false, 0)
		}
		else {
			this.collapsed = true
			setTimeout(() => this.active = false, 300)
		}
	}

	handlePlay(event: Event) {
		if (this.showQueueButtons)
			this.musicService.addAndPlay(this.track.identifier)
		else
			this.musicService.play(this.track.identifier)
		event.stopPropagation()
	}

	handlePause(event: Event) {
		event.stopPropagation()
	}
}
