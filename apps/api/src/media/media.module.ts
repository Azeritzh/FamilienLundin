import { Module } from "@nestjs/common"
import { MusicService } from "./music.service"
import { VideoService } from "./video.service"

@Module({
	providers: [MusicService, VideoService],
	exports: [MusicService, VideoService],
})
export class MediaModule { }
