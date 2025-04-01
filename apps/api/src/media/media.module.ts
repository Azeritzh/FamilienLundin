import { Module } from "@nestjs/common"
import { MusicService } from "./music.service"

@Module({
	providers: [MusicService],
	exports: [MusicService],
})
export class MediaModule { }
