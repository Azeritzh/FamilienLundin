import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { MusicService } from "../../media/music.service"

@Controller("music")
export class MusicController {
	constructor(private readonly musicService: MusicService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-library")
	async getLibrary() {
		return this.musicService.library
	}

	@UseGuards(JwtAuthGuard)
	@Get("files/**")
	async getFile(@Req() req, @Res() res) {
		const filePath = decodeURIComponent(req.url.split("music/files/")[1])
		res.sendFile(filePath, { root: this.musicService.libraryPath })
	}
}
