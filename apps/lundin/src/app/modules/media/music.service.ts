import { Injectable } from "@angular/core"
import { BehaviorSubject, Subject } from "rxjs"

@Injectable()
export class MusicService {
	loaded$ = new BehaviorSubject<void>(null)
	musicLibrary: { [folder: string]: Album } = {}

	tracksAll: Track[] = []
	tracksNoDuplicates: Track[] = []
	tracksQueue: Track[] = []
	queue: TrackIdentifier[] = []

	playingIndex: number | null = null
	nextTrack$ = new Subject<Track>()

	constructor() {
		fetch("/api/music/get-library")
			.then(async response => this.loadLibrary(await response.json()))
	}

	private loadLibrary(albums: { [folder: string]: Album }) {
		this.musicLibrary = albums
		this.tracksAll = Object.entries(albums).flatMap(([, value]) => value.tracks)
		this.tracksNoDuplicates = this.tracksAll.filter(x => x.duplicateOf === null)
		this.loaded$.next()
	}

	play(track: TrackIdentifier, updateIndex = true) {
		if (updateIndex) {
			const index = this.queue.indexOf(track)
			if (index !== -1)
				this.playingIndex = index
		}
		this.nextTrack$.next(this.trackFor(track))
	}

	trackFor(trackIdentifier: TrackIdentifier) {
		const [folder, title] = trackIdentifier.split("|")
		return this.musicLibrary[folder].tracks.find(x => x.title === title)
	}

	addAndPlay(...tracks: TrackIdentifier[]) {
		if (this.playingIndex === null)
			this.playingIndex = 0
		else
			this.playingIndex++
		this.queue.splice(this.playingIndex, 0, ...tracks)
		this.updateTracksQueue()
		this.play(tracks[0], false)
	}

	addAsNext(track: TrackIdentifier) {
		this.queue.splice(this.playingIndex + 1, 0, track)
		this.updateTracksQueue()
	}

	addAsLast(...tracks: TrackIdentifier[]) {
		this.queue.push(...tracks)
		this.updateTracksQueue()
	}

	removeFromQueue(track: TrackIdentifier) {
		const index = this.queue.indexOf(track)
		if (index !== -1)
			this.queue.splice(index, 1)
		this.updateTracksQueue()
	}

	private updateTracksQueue() {
		this.tracksQueue = this.queue.map(x => this.trackFor(x))
	}
}

export interface Album {
	album: string
	artist: string
	year: string
	tracks: Track[]
}

export interface Track {
	track: number | null
	title: string
	artists: string[]
	albumArtist: string
	album: string
	year: string
	genre: string[]
	length: string
	filename: string | null
	duplicateOf: string | null
	identifier: string
}

export type TrackIdentifier = string
