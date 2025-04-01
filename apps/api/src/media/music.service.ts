import { Injectable } from "@nestjs/common"
import * as fs from "fs"

@Injectable()
export class MusicService {
	library: { [index: string]: any } = {}

	constructor() {
		const rootPath = "F:/Media/Lyd/Musik"
		const files = this.getFiles(rootPath)
			.filter(x => x.toLowerCase().endsWith(".mp3") || x.toLowerCase().endsWith(".flac")|| x.toLowerCase().endsWith(".mp4"))
			.map(x => x.substring(rootPath.length + 1))

		for (const file of files)
			this.library[file] = {}
	}

	private getFiles(directory: string) {
		if(!fs.existsSync(directory))
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
