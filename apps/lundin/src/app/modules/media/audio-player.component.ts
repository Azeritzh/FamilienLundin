import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs"
import { MusicService, Track } from "./music.service"

@Component({
	selector: "lundin-audio-player",
	templateUrl: "./audio-player.component.html",
	styleUrls: ["./audio-player.component.scss"],
	imports: [
		CommonModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnDestroy {
	subscriptions: { [index: string]: Subscription } = {}
	intervalId: number = 0
	track: Track | null = null
	isPlaying = false
	currentTime = 0
	duration = 0
	isMuted = false
	volume = 1
	isSeeking = false

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		public musicService: MusicService,
	) {
		this.subscriptions["track"] = this.musicService.nextTrack$.subscribe(track => {
			this.track = track
			this.isPlaying = !!track
			this.changeDetectorRef.markForCheck()
		})
		this.isPlaying = musicService.isPlaying()
		this.volume = musicService.audioElement.volume
		this.updateCurrentTime()
		this.intervalId = window.setInterval(this.updateCurrentTime, 1000)
	}

	ngOnDestroy() {
		for (const key in this.subscriptions)
			this.subscriptions[key].unsubscribe()
		window.clearInterval(this.intervalId)
	}

	private updateCurrentTime = () => {
		if (this.isSeeking)
			return
		this.duration = this.musicService.audioElement.duration || 0
		this.currentTime = this.musicService.audioElement.currentTime
		this.changeDetectorRef.markForCheck()
	}

	getVolumeIcon() {
		if (this.isMuted)
			return "/assets/images/icons/volume-mute.svg"
		if (this.musicService.audioElement.volume < 0.5)
			return "/assets/images/icons/volume-low.svg"
		return "/assets/images/icons/volume-high.svg"
	}

	toggleMusic() {
		this.isPlaying = this.musicService.isPlaying()
		if (this.isPlaying)
			this.musicService.pause()
		else
			this.musicService.unpause()
		this.isPlaying = !this.isPlaying
	}

	toggleMute() {
		this.musicService.audioElement.muted = !this.musicService.audioElement.muted
		this.isMuted = this.musicService.audioElement.muted
	}

	onVolumeInput(event: Event) {
		this.musicService.audioElement.volume = +(event.target as HTMLInputElement)?.value
	}

	onSeekInput(event: Event) {
		this.isSeeking = true
		this.currentTime = +(event.target as HTMLInputElement)?.value
	}

	finishSeek() {
		this.isSeeking = false
		this.musicService.audioElement.currentTime = this.currentTime
	}

	timeFormat(seconds: number) {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = Math.floor(seconds % 60)
		return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds
	}
}
