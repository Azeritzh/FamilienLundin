import { Component, ElementRef, ViewChild } from "@angular/core"
import { MusicService } from "./music.service"

@Component({
	selector: "lundin-music",
	templateUrl: "./music.component.html",
	styleUrls: ["./music.component.scss"],
})
export class MusicComponent {
	@ViewChild("audioPlayer") audioPlayer: ElementRef<HTMLAudioElement>
	currentTab = "library"
	currentSong = ""

	constructor(
		public musicService: MusicService
	) {
		this.musicService.nextTrack$.subscribe(track => {
			this.playSong(track.filename ?? track.duplicateOf)
		})
	}

	ngAfterViewInit() {
		this.audioPlayer.nativeElement.addEventListener("ended", () => {
			if(this.musicService.playingIndex < this.musicService.queue.length - 1)
				this.musicService.play(this.musicService.queue[this.musicService.playingIndex + 1])
		})
	}

	private playSong(file: string) {
		this.audioPlayer.nativeElement.src = "api/music/files/" + file.replace(/#/g, "ꖛ") // Replace # with ꖛ to avoid issues with the URL
		this.audioPlayer.nativeElement.onloadeddata = () => this.audioPlayer.nativeElement.play()
		this.currentSong = file
	}

	selectTab(tab: string) {
		this.currentTab = tab
	}
}
