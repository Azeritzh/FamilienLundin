
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core"
import { firstValueFrom } from "rxjs"
import { NavigationService } from "../../services/navigation.service"
import { MusicService, Track } from "./music.service"
import { PlaylistSelectorComponent } from "./playlist-selector.component"
import { PlaylistService } from "./playlist.service"

@Component({
	selector: "lundin-track",
	templateUrl: "./track.component.html",
	styleUrls: ["./track.component.scss"],
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackComponent {
	@Input() track!: Track
	@Input() fields: Field[] = [
		{ titleFor: (track) => track.title, size: 2 },
		{ titleFor: (track) => track.artists.join(", ") },
		{ titleFor: (track) => track.album },
		{ titleFor: (track) => track.albumArtist },
	]
	@Input() isPlaying = false
	@Input() showQueueButtons = true
	@Input() showRemoveButton = false
	@Output() remove = new EventEmitter<void>()
	active = false
	collapsed = true

	constructor(
		elementRef: ElementRef,
		private changeDetectorRef: ChangeDetectorRef,
		private navigationService: NavigationService,
		private musicService: MusicService,
		private playlistService: PlaylistService,
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
		this.changeDetectorRef.markForCheck()
		setTimeout(() => {
			this.collapsed = false
			this.changeDetectorRef.markForCheck()
		}, 0)
	}

	private deactivate() {
		this.collapsed = true
		this.changeDetectorRef.markForCheck()
		setTimeout(() => {
			this.active = false
			this.changeDetectorRef.markForCheck()
		}, 300)
	}

	handlePlay() {
		if(this.musicService.currentTrack?.identifier === this.track.identifier)
			this.musicService.unpause()
		else if (this.showQueueButtons)
			this.musicService.addAndPlay(this.track.identifier)
		else
			this.musicService.play(this.track.identifier)
	}

	handlePause() {
		this.musicService.pause()
	}

	handleAddNext() {
		this.musicService.addAsNext(this.track.identifier)
	}

	handleAddLast() {
		this.musicService.addAsLast(this.track.identifier)
	}

	handleRemove() {
		this.remove.emit()
	}

	async handleAddToList() {
		const component = await this.navigationService.openAsOverlay(PlaylistSelectorComponent)
		const playlist = await firstValueFrom(component.selectedPlaylist)
		this.navigationService.closeOverlay()
		;(<string[]>playlist.content).push(this.track.identifier)
		if (playlist._id)
			this.playlistService.updatePlaylist(playlist)
		else
			this.playlistService.addPlaylist(playlist)
	}

	setRating(rating: number) {
		this.musicService.setRating(this.track.identifier, rating)
	}
}

interface Field {
	titleFor: (track: Track) => string
	size?: number
}