import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core"
import { MusicService, Track } from "./music.service"

@Component({
	selector: "lundin-track",
	templateUrl: "./track.component.html",
	styleUrls: ["./track.component.scss"],
})
export class TrackComponent {
	@Input() track: Track
	@Input() fields: Field[] = [
		{ titleFor: (track) => track.title, size: 2 },
		{ titleFor: (track) => track.artists.join(", ") },
		{ titleFor: (track) => track.album },
		{ titleFor: (track) => track.albumArtist },
	]
	@Input() isPlaying = false
	@Input() showQueueButtons = true
	@Output() remove = new EventEmitter<void>()
	active = false
	collapsed = true

	constructor(
		elementRef: ElementRef,
		public musicService: MusicService
	) {
		window.addEventListener("click", (event: Event) => {
			if (!this.active)
				return
			const isTarget = event.target === elementRef.nativeElement || elementRef.nativeElement.contains(event.target as Node)
			if (!isTarget)
				this.deactivate()
		})
	}

	@HostListener("click")
	click() {
		if (!this.active)
			this.activate()
		else
			this.deactivate()
	}

	private activate() {
		this.active = true
		setTimeout(() => this.collapsed = false, 0)
	}

	private deactivate() {
		this.collapsed = true
		setTimeout(() => this.active = false, 300)
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

	handleAddNext(event: Event) {
		this.musicService.addAsNext(this.track.identifier)
		event.stopPropagation()
	}

	handleAddLast(event: Event) {
		this.musicService.addAsLast(this.track.identifier)
		event.stopPropagation()
	}

	handleRemove(event: Event) {
		this.remove.emit()
		event.stopPropagation()
	}
}

interface Field {
	titleFor: (track: Track) => string
	size?: number
}