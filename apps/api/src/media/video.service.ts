import { Injectable } from "@nestjs/common"
import * as fs from "fs"

@Injectable()
export class VideoService {
	libraryPath = "/mnt/data/Media/Video/Film"
	library: { [index: string]: any } = {}

	constructor() {
		const files = this.getFiles(this.libraryPath)
			.filter(x => x.toLowerCase().endsWith(".mkv") || x.toLowerCase().endsWith(".mp4") || x.toLowerCase().endsWith(".avi") || x.toLowerCase().endsWith(".webm"))
			.map(x => x.substring(this.libraryPath.length + 1))

		for (const file of files)
			this.library[file] = {}
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
