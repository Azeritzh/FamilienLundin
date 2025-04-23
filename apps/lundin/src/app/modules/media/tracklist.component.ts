import { KeyValue } from "@angular/common"
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core"
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject, Subscription } from "rxjs"
import { MusicService, Track } from "./music.service"
import { PlaylistService } from "./playlist.service"
import { NavigationService } from "../../services/navigation.service"
import { PlaylistSelectorComponent } from "./playlist-selector.component"

@Component({
	selector: "lundin-tracklist",
	templateUrl: "./tracklist.component.html",
	styleUrls: ["./tracklist.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent implements OnDestroy {
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
	private knownPosition: { index: number, height: number, top: number } = null

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

	private search = () => {
		this.changeDetectorRef.markForCheck()
		if (!this.query)
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

	isVisible(element: HTMLElement, index: number) {
		if (this.knownPosition === null) {
			const rect = element.getBoundingClientRect()
			this.knownPosition = { index, height: rect.bottom - rect.top, top: rect.top }
		}
		const position = (index - this.knownPosition.index) * this.knownPosition.height + this.knownPosition.top
		return 0 < position && position < window.innerHeight
	}

	async addToPlaylist() {
		const component = await this.navigationService.openAsOverlay(PlaylistSelectorComponent)
		const playlist = await firstValueFrom(component.selectedPlaylist)
		this.navigationService.closeOverlay()
		;(<string[]>playlist.content).push(...this.shownTracks.map(x => x.identifier))
		if (playlist._id)
			this.playlistService.updatePlaylist(playlist)
		else
			this.playlistService.addPlaylist(playlist)
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