import { Injectable } from "@angular/core"

@Injectable()
export class MusicService {
	musicLibrary: { [folder: string]: Album } = {}
	tracksAll: Track[] = []
	tracksNoDuplicates: Track[] = []
	queue: Track[] = []

	constructor() {
		fetch("/api/music/get-library")
			.then(async response => this.loadLibrary(await response.json()))
	}

	private loadLibrary(albums: { [folder: string]: Album }) {
		this.musicLibrary = albums
		this.tracksAll = Object.entries(albums).flatMap(([, value]) => value.tracks)
		this.tracksNoDuplicates = this.tracksAll.filter(x => x.duplicateOf === null)
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
}