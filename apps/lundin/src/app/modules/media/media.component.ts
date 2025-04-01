import { Component } from "@angular/core"

@Component({
	selector: "lundin-media",
	templateUrl: "./media.component.html",
	styleUrls: ["./media.component.scss"],
})
export class MediaComponent {
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
		document.getElementById("aberne")["src"] = "api/music/files/" + file
	}
}
