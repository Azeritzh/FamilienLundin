import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { MusicRating } from "@lundin/api-interfaces"
import { randomise } from "@lundin/utility"
import { BehaviorSubject, firstValueFrom } from "rxjs"
import { AuthService } from "../../services/auth.service"

@Injectable({
	providedIn: "root",
})
export class MusicService {
	loaded$ = new BehaviorSubject<void>(undefined)
	musicLibrary: { [folder: string]: Album } = {}
	ratings: { [userId: number]: { [trackId: string]: number } } = {}

	tracksAll: Track[] = []
	tracksNoDuplicates: Track[] = []
	tracksQueue: Track[] = []
	queue: TrackIdentifier[] = []

	currentIndex: number | null = null
	currentTrack: Track | null = null
	nextTrack$ = new BehaviorSubject<Track | null>(null)
	audioElement: HTMLAudioElement = null!

	constructor(
		private authService: AuthService,
		private httpClient: HttpClient
	) {
		Promise.all([
			firstValueFrom(this.httpClient.get<{ [folder: string]: Album }>("api/music/get-library")),
			firstValueFrom(this.httpClient.get<MusicRating[]>("api/music/get-ratings")),
		]).then(([albums, ratings]) => {
			this.loadLibrary(albums)
			this.loadRatings(ratings)
			this.loaded$.next()
		})
		this.createAudioElement()
	}

	private loadLibrary(albums: { [folder: string]: Album }) {
		this.musicLibrary = albums
		this.tracksAll = Object.entries(albums).flatMap(([, value]) => value.tracks)
		this.tracksNoDuplicates = this.tracksAll.filter(x => x.duplicateOf === null)
	}

	private loadRatings(ratingSets: MusicRating[]) {
		this.ratings = {}
		for (const ratingSet of ratingSets)
			this.ratings[ratingSet.userId] = ratingSet.ratings
	}

	private createAudioElement() {
		this.audioElement = document.getElementById("music-player") as HTMLAudioElement
		if (this.audioElement)
			return console.warn("Audio element already exists")
		this.audioElement = document.createElement("audio")
		this.audioElement.id = "music-player"
		this.audioElement.style.display = "none"
		document.body.appendChild(this.audioElement)

		this.audioElement.addEventListener("ended", () => {
			this.startNextTrack()
		})
	}

	setRating(trackId: TrackIdentifier, rating: number) {
		const userId = this.authService.loginInfo?.userId!
		if (!this.ratings[userId])
			this.ratings[userId] = {}
		this.ratings[userId][trackId] = rating
		firstValueFrom(this.httpClient.post("api/music/set-rating", { trackId, rating }))
	}

	private startNextTrack() {
		if (this.currentIndex === null)
			this.currentIndex = 0
		else
			this.currentIndex++

		if (this.currentIndex < this.queue.length)
			this.playTrack(this.trackFor(this.queue[this.currentIndex]))
		else
			this.currentIndex = null
	}

	play(trackId: TrackIdentifier, updateIndex = true) {
		if (updateIndex) {
			const index = this.queue.indexOf(trackId)
			if (index !== -1)
				this.currentIndex = index
		}
		this.playTrack(this.trackFor(trackId))
	}

	private playTrack(track: Track | null) {
		const file = track?.filename ?? track?.duplicateOf
		if (!file)
			return
		this.currentTrack = track
		this.audioElement.src = "api/music/files/" + file.replace(/#/g, "ꖛ") // Replace # with ꖛ to avoid issues with the URL
		this.audioElement.onloadeddata = () => this.audioElement.play()
		this.nextTrack$.next(track)
	}

	pause() {
		this.audioElement.pause()
	}

	unpause() {
		this.audioElement.play()
	}

	isPlaying() {
		return !this.audioElement.paused && !this.audioElement.ended && this.audioElement.readyState > 2
	}

	trackFor(trackIdentifier: TrackIdentifier) {
		const [folder, title] = trackIdentifier.split("|")
		return this.musicLibrary[folder].tracks.find(x => x.title === title) ?? null
	}

	addAndPlay(...tracks: TrackIdentifier[]) {
		if (this.currentIndex === null)
			this.currentIndex = 0
		else
			this.currentIndex++
		this.queue.splice(this.currentIndex, 0, ...tracks)
		this.updateTracksQueue()
		this.play(tracks[0], false)
	}

	addAsNext(track: TrackIdentifier) {
		this.queue.splice((this.currentIndex ?? -1) + 1, 0, track)
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
		this.tracksQueue = this.queue.map(x => this.trackFor(x)).filter(x => x !== null)
	}

	randomiseQueue() {
		this.queue = randomise(this.queue)
		this.updateTracksQueue()
	}

	//inputs:
	// start new song
	// pause/unpause current song
	// stop current song
	// seek to new position
	// go to next song (start new song, but we already know which)
	// go to previous song (start new song, but we already know which)
	// adjust volume

	//outputs:
	// song started // when going to next song
	// song stopped // when at end of queue
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
