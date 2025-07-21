import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { VideoService } from "../../media/video.service"

@Controller("video")
export class VideoController {
	constructor(private readonly videoService: VideoService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-library")
	async getLibrary() {
		return Object.keys(this.videoService.library)
	}

	@UseGuards(JwtAuthGuard)
	@Get("files/*path")
	async getFile(@Req() req, @Res() res) {
		const filePath = decodeURIComponent(req.url.split("video/files/")[1])
		res.sendFile(filePath, { root: this.videoService.libraryPath })
	}
}
