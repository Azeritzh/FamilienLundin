import { GalleryStructure } from "@lundin/api-interfaces"
import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common"
import * as fs from "fs"
import sharp from "sharp"
import { JwtAuthGuard } from "../../auth/jwt.strategy"

@Controller("gallery")
export class GalleryController {
	subGalleries = { "Kristjan": "/mnt/data/Kristjan/Billeder/Kamera" }

	@UseGuards(JwtAuthGuard)
	@Get("get-folders")
	async getFolders() {
		const result: GalleryStructure = {}
		for (const [key, gallery] of Object.entries(this.subGalleries))
			result[key] = this.getFoldersIn(gallery)
		return result
	}

	private getFoldersIn(directory: string) {
		if (!fs.existsSync(directory))
			return []
		const allFolders: string[] = []
		for (const file of fs.readdirSync(directory, { withFileTypes: true }))
			if (file.isDirectory())
				allFolders.push(file.name)
		return allFolders
	}

	@UseGuards(JwtAuthGuard)
	@Get("get-files/:subGallery/:folder")
	async getFiles(@Param("subGallery") subGallery: string, @Param("folder") folder: string) {
		const galleryPath = this.subGalleries[subGallery]
		if (!galleryPath)
			return []

		const files = this.getFilesIn(`${galleryPath}/${folder}`)
		for (const file of files)
			this.ensureThumbnailFor(file)

		return files.map(x => `${subGallery}/${folder}/${x.split("/").pop()}`)
	}

	private ensureThumbnailFor(file: string) {
		if(file.match(/\.(mp4|mkv|webm|avi)$/i))
			return
		const parts = file.split("/") // we assume the path is "/mnt/data/Name/..."
		const thumbnailDir = `thumbnails/${parts[3]}/${parts[parts.length - 2]}`
		const thumbnailPath = thumbnailDir + "/" + parts[parts.length - 1]
		if (!fs.existsSync(thumbnailDir))
			fs.mkdirSync(thumbnailDir, { recursive: true })
		if (fs.existsSync(thumbnailPath))
			return

		sharp(file)
			.resize(300)
			.toFile(thumbnailPath)
			.catch(err => {
				console.error("Error creating thumbnail for", file, err)
			})
	}

	private getFilesIn(directory: string) {
		if (!fs.existsSync(directory))
			return []
		const allFiles: string[] = []
		const files = fs.readdirSync(directory, { withFileTypes: true })
		for (const file of files)
			if (file.isFile() && file.name.match(/\.(jpg|jpeg|png|gif|avif|mp4|mkv|webm|avi)$/i))
				allFiles.push(`${directory}/${file.name}`)
		return allFiles
	}

	@UseGuards(JwtAuthGuard)
	@Get("files/*path")
	async getFile(@Req() req, @Res() res) {
		const isThumbnail = req.url.includes("thumbnails/")
		const filePath = isThumbnail
			? decodeURIComponent(req.url.split("thumbnails/")[1])
			: decodeURIComponent(req.url.split("images/")[1])

		const subGallery = filePath.split("/")[0]
		if (!this.subGalleries[subGallery])
			throw new Error("Invalid gallery path")

		if (isThumbnail)
			res.sendFile(filePath, { root: "thumbnails" })
		else
			res.sendFile(filePath.slice(subGallery.length + 1), { root: this.subGalleries[subGallery] })
	}
}
