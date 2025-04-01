import { Component, ElementRef, ViewChild } from "@angular/core"

@Component({
	selector: "lundin-music",
	templateUrl: "./music.component.html",
	styleUrls: ["./music.component.scss"],
})
export class MusicComponent {
	@ViewChild("audioPlayer") audioPlayer: ElementRef<HTMLAudioElement>
	musicLibrary = []

	constructor() {
		fetch("/api/music/get-library")
			.then(async response => this.loadLibrary(await response.json()))
	}

	private loadLibrary(files: string[]) {
		this.musicLibrary = files.map(x => this.parseSongFileName(x)).filter(x => x !== null)
	}

	private parseSongFileName(file: string) {
		try {
			const [albumArtist, album, fileName] = file.split("/")
			const [artist, titleWithFormat] = fileName.split(" - ")
			const title = titleWithFormat.split(".")[0]
			return { artist, albumArtist, album, title, file }
		}
		catch {
			console.error("Failed to parse file name", file)
			return null
		}
	}

	playSong(file: string) {
		this.audioPlayer.nativeElement.src = "api/music/files/" + file
		this.audioPlayer.nativeElement.onloadeddata = () => this.audioPlayer.nativeElement.play()
	}
}
