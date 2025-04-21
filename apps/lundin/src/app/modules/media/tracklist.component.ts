import { KeyValue } from "@angular/common"
import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core"
import { MusicService, Track } from "./music.service"
import { debounceTime, distinctUntilChanged, Subject, Subscription } from "rxjs"

@Component({
	selector: "lundin-tracklist",
	templateUrl: "./tracklist.component.html",
	styleUrls: ["./tracklist.component.scss"],
})
export class TrackListComponent implements OnDestroy{
	subscription: Subscription | null
	@Input() tracks: Track[] = []
	@Input() isQueue = false
	@Output() remove = new EventEmitter<Track>()
	columns: { [index: string]: Column } = {
		title: { enabled: true, title: "Titel", titleFor: (track) => track.title, size: 2 },
		artistsCombined: { enabled: true, title: "Kunstnere (samlet)", titleFor: combinedArtists },
		artists: { enabled: false, title: "Kunstnere", titleFor: (track) => track.artists.join(", ") },
		album: { enabled: true, title: "Album", titleFor: (track) => track.album },
		albumArtist: { enabled: false, title: "Albumkunstner", titleFor: (track) => track.albumArtist },
		year: { enabled: true, title: "Year", titleFor: (track) => track.year, size: 0.4 },
		genres: { enabled: false, title: "Genrer", titleFor: (track) => track.genre.join(", "), size: 0.4 },
		duration: { enabled: true, title: "Varighed", titleFor: (track) => track.length, size: 0.4 },
	}
	enabledColumns: Column[] = []
	shownTracks: Track[] | null = null
	query$ = new Subject<string>()
	query = ""

	constructor(
		public musicService: MusicService
	) {
		this.updateEnabledColumns()
		this.subscription = this.query$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
		).subscribe(this.search)
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	private search = () => {
		if(!this.query)
			this.shownTracks = null
		const search = this.query.toLowerCase()
		this.shownTracks = this.tracks.filter(track => {
			const text = this.enabledColumns.map(column => column.titleFor(track)).join(" ").toLowerCase()
			return text.includes(search)
		})
	}

	updateEnabledColumns() {
		this.enabledColumns = Object.values(this.columns)
			.filter(x => x.enabled)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) { return 1 } // This is used with keyvalue pipe to keep the order of the columns
}

interface Column {
	enabled: boolean
	title: string
	titleFor: (track: Track) => string
	size?: number
}

function combinedArtists(track: Track) {
	if (track.artists.length === 1 && track.artists[0] === track.albumArtist)
		return track.albumArtist
	return track.albumArtist + "(" + track.artists.join(", ") + ")"
}