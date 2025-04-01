import { Controller, Get, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { MusicService } from "../../media/music.service"

@Controller("music")
export class MusicController {
	constructor(private readonly musicService: MusicService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-library")
	async getLibrary() {
		return Object.keys(this.musicService.library)
	}
}
