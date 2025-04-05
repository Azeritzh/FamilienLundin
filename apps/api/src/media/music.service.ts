import { Injectable } from "@nestjs/common"
import * as fs from "fs"

@Injectable()
export class MusicService {
	libraryPath = "/mnt/data/Media/Lyd/Musik"
	library: { [index: string]: any } = {}

	constructor() {
		const files = this.getFiles(this.libraryPath)
			.filter(x => x.endsWith("album.json"))

		for (const file of files){
			const identifier = file.substring(this.libraryPath.length + 1, file.length - 11)
			this.library[identifier] = JSON.parse(fs.readFileSync(file, "utf-8"))
		}
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
