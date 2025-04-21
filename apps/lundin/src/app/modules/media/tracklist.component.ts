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
	columns: { [index: string]: Column } = {
		title: { enabled: true, title: "Titel", titleFor: (track) => track.title },
		artists: { enabled: true, title: "Kunstnere", titleFor: (track) => track.artists.join(", ") },
		album: { enabled: true, title: "Album", titleFor: (track) => track.album },
		albumArtist: { enabled: true, title: "Albumkunstner", titleFor: (track) => track.albumArtist },
		year: { enabled: false, title: "Year", titleFor: (track) => track.year },
		genres: { enabled: false, title: "Genrer", titleFor: (track) => track.genre.join(", ") },
		duration: { enabled: false, title: "Varighed", titleFor: (track) => track.length },
	}

	constructor(
		public musicService: MusicService
	) { }

	enabledColumns(){
		return Object.values(this.columns).filter(x => x.enabled)
	}
}

interface Column {
	enabled: boolean
	title: string
	titleFor: (track: Track) => string
}