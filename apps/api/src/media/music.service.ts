import { Injectable } from "@nestjs/common"
import * as fs from "fs"

@Injectable()
export class MusicService {
	libraryPath = "C:/Media/Lyd/Musik"
	library: { [folder: string]: Album } = {}

	constructor() {
		const files = this.getFiles(this.libraryPath)
			.filter(x => x.endsWith("album.json"))

		for (const file of files) {
			const identifier = file.substring(this.libraryPath.length + 1, file.length - 11)
			try {
				this.library[identifier] = JSON.parse(fs.readFileSync(file, "utf-8"))
				for (const track of this.library[identifier].tracks)
					this.fillFileNames(track, identifier)
			}
			catch {
				console.error("Failed to parse file:", file)
			}
		}
	}

	private fillFileNames(track: Track, folder: string) {
		track.filename = folder + "/" + track.filename
	}

	private getFiles(directory: string) {
		if (!fs.existsSync(directory))
			return []
		const allFiles: string[] = []
		const files = fs.readdirSync(directory, { withFileTypes: true })
		for (const file of files) {
			if (file.isFile())
				allFiles.push(`${directory}/${file.name}`)
			else if (file.isDirectory())
				allFiles.push(...this.getFiles(`${directory}/${file.name}`))
		}
		return allFiles
	}
}

interface Album {
	album: string
	artist: string
	year: string
	tracks: Track[]
}

interface Track {
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
