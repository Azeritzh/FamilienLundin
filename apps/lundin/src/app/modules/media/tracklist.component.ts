import { KeyValue } from "@angular/common"
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from "@angular/core"
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject, Subscription } from "rxjs"
import { NavigationService } from "../../services/navigation.service"
import { MusicService, Track } from "./music.service"
import { PlaylistSelectorComponent } from "./playlist-selector.component"
import { PlaylistService } from "./playlist.service"

@Component({
	selector: "lundin-tracklist",
	templateUrl: "./tracklist.component.html",
	styleUrls: ["./tracklist.component.scss"],
	standalone: false,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent implements OnChanges, OnDestroy {
	subscription: Subscription | null
	@Input() tracks: Track[] = []
	@Input() isQueue = false
	@Input() showRemoveButtons = false
	@Input() randomiseLocally = true // randomises within this tracklist when true, leaves it to parent otherwise
	@Output() remove = new EventEmitter<Track>()
	@Output() randomise = new EventEmitter<Track>()
	columns: { [index: string]: Column } = {
		track: { enabled: false, title: "Nummer", titleFor: (track) => track.track?.toString() ?? "", size: 0.2 },
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
	showColumnSettings = false

	shownTracks: Track[] | null = null
	query$ = new Subject<string>()
	query = ""
	private knownPosition: { index: number, height: number, top: number } | null = null

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		public musicService: MusicService,
		private navigationService: NavigationService,
		private playlistService: PlaylistService,
	) {
		this.updateEnabledColumns()
		this.subscription = this.query$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
		).subscribe(this.search)
		window.addEventListener("scroll", () => {
			this.knownPosition = null
			this.changeDetectorRef.markForCheck()
		}, true)
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	// re-search when tracks change
	ngOnChanges(changes: { [index: string]: any }) {
		if (changes["tracks"])
			this.search()
	}

	private search = () => {
		this.changeDetectorRef.markForCheck()
		if (!this.query)
			this.shownTracks = this.tracks
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

	isVisible(element: HTMLElement, index: number) {
		if (this.knownPosition === null) {
			const rect = element.getBoundingClientRect()
			this.knownPosition = { index, height: rect.bottom - rect.top, top: rect.top }
		}
		const position = (index - this.knownPosition.index) * this.knownPosition.height + this.knownPosition.top
		return 0 < position && position < window.innerHeight
	}

	playAll() {
		this.musicService.addAndPlay(...(this.shownTracks ?? this.tracks).map(x => x.identifier))
	}

	addToQueue() {
		this.musicService.addAsLast(...(this.shownTracks ?? this.tracks).map(x => x.identifier))
	}

	async addToPlaylist() {
		const component = await this.navigationService.openAsOverlay(PlaylistSelectorComponent)
		const playlist = await firstValueFrom(component.selectedPlaylist)
		this.navigationService.closeOverlay()
		;(<string[]>playlist.content).push(...(this.shownTracks ?? this.tracks).map(x => x.identifier))
		if (playlist._id)
			this.playlistService.updatePlaylist(playlist)
		else
			this.playlistService.addPlaylist(playlist)
	}

	randomiseTracks() {
		if (!this.randomiseLocally)
			return this.randomise.emit()
		this.tracks = [...this.tracks]
		this.tracks.sort(() => Math.random() - 0.5)
		this.shownTracks = this.tracks
		this.randomise.emit()
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
	return track.albumArtist + " (" + track.artists.join(", ") + ")"
}