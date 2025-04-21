import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core"
import { debounceTime, distinctUntilChanged, Subject, Subscription } from "rxjs"
import { Album, MusicService } from "./music.service"

@Component({
	selector: "lundin-albums",
	templateUrl: "./albums.component.html",
	styleUrls: ["./albums.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsComponent implements OnDestroy {
	subscriptions: { [index: string]: Subscription } = {}
	albums: DecoratedAlbum[] = []
	shownAlbums: DecoratedAlbum[] | null = null
	currentAlbum: DecoratedAlbum | null = null
	query$ = new Subject<string>()
	query = ""

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private musicService: MusicService,
	) {
		this.subscriptions["loaded"] = this.musicService.loaded$.subscribe(() => {
			this.albums = Object.entries(this.musicService.musicLibrary).map(([folder, album]) => ({ ...album, cover: folder + "/cover.jpg" }))
		})

		this.subscriptions["query"] = this.query$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
		).subscribe(this.search)
	}

	ngOnDestroy() {
		for (const sub of Object.values(this.subscriptions))
			sub.unsubscribe()
	}

	private search = () => {
		this.changeDetectorRef.markForCheck()
		if (!this.query)
			this.shownAlbums = null
		const search = this.query.toLowerCase()
		this.shownAlbums = this.albums.filter(album => {
			const text = [album.album, album.artist].join(" ").toLowerCase()
			return text.includes(search)
		})
	}

	selectAlbum(album: DecoratedAlbum) {
		this.currentAlbum = album
	}

	addCurrentAlbum() {
		this.musicService.addAsLast(...this.currentAlbum.tracks.map(x => x.identifier))
	}
}

type DecoratedAlbum = Album & { cover: string }