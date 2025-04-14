import { Component, ElementRef, ViewChild } from "@angular/core"

@Component({
	selector: "lundin-music",
	templateUrl: "./music.component.html",
	styleUrls: ["./music.component.scss"],
})
export class MusicComponent {
	@ViewChild("audioPlayer") audioPlayer: ElementRef<HTMLAudioElement>
	musicLibrary = []
	currentTab = "library"
	currentSong = ""

	constructor() {
		fetch("/api/music/get-library")
			.then(async response => this.loadLibrary(await response.json()))
	}

	private loadLibrary(albums: { [index: string]: any }) {
		this.musicLibrary = Object.entries(albums).flatMap(([key, value]) => {
			value.tracks
			for (const track of value.tracks)
				track.filename = key + "/" + track.filename
			return value.tracks
		})
	}

	playSong(file: string) {
		this.audioPlayer.nativeElement.src = "api/music/files/" + file.replace(/#/g, "ꖛ") // Replace # with ꖛ to avoid issues with the URL
		this.audioPlayer.nativeElement.onloadeddata = () => this.audioPlayer.nativeElement.play()
		this.currentSong = file
	}

	selectTab(tab: string) {
		this.currentTab = tab
	}
}
