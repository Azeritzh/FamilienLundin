import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { MusicService } from "../../media/music.service"
import { StorageService } from "../../storage/storage.service"
import { RequestWithUser } from "./auth.controller"
import { MusicPlaylist, MusicRatingUpdate } from "@lundin/api-interfaces"

@Controller("music")
export class MusicController {
	constructor(
		private readonly musicService: MusicService,
		private readonly storageService: StorageService,
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-library")
	async getLibrary() {
		return this.musicService.library
	}

	@UseGuards(JwtAuthGuard)
	@Get("files/*path")
	async getFile(@Req() req, @Res() res) {
		const filePath = decodeURIComponent(req.url.split("music/files/")[1])
			.replace(/ꖛ/g, "#")  // Restore # in the filename
		res.sendFile(filePath, { root: this.musicService.libraryPath })
	}

	@UseGuards(JwtAuthGuard)
	@Get("get-ratings")
	async getRatings() {
		return this.storageService.musicRatingCollection.find() ?? []
	}

	@UseGuards(JwtAuthGuard)
	@Post("set-rating")
	async setRating(@Req() request: RequestWithUser, @Body() update: MusicRatingUpdate) {
		const existing = this.storageService.musicRatingCollection.findOne({ userId: request.user._id })
		if (!existing || !existing.ratings)
			return this.storageService.musicRatingCollection.insertOne({
				_id: 0,
				userId: request.user._id,
				ratings: { [update.trackId]: update.rating },
			})
		else
			return this.storageService.musicRatingCollection.updateOne({ userId: request.user._id },
				ratings => ratings[update.trackId] = update.rating
			)
	}

	@UseGuards(JwtAuthGuard)
	@Get("get-playlists")
	async getPlaylists(@Req() request: RequestWithUser) {
		return this.storageService.musicPlaylistCollection.find(x => x.shared || x.userId === request.user._id) ?? []
	}

	@UseGuards(JwtAuthGuard)
	@Post("add-playlist")
	async addPlaylist(@Req() request: RequestWithUser, @Body() playlist: MusicPlaylist) {
		playlist.userId = request.user._id
		return this.storageService.musicPlaylistCollection.insertOne(playlist)
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-playlist")
	async updatePlaylist(@Req() request: RequestWithUser, @Body() playlist: MusicPlaylist) {
		if (request.user._id !== playlist.userId)
			throw new Error("You are not allowed to update this playlist") // TODO: return something instead?
		return this.storageService.musicPlaylistCollection.updateOne({ _id: playlist._id }, playlist)
	}

	@UseGuards(JwtAuthGuard)
	@Delete("delete-playlist/:id")
	async deletePlaylist(@Param("id") id, @Req() request: RequestWithUser) {
		const playlist = await this.storageService.musicPlaylistCollection.findOne({ _id: +id })
		if (request.user._id !== playlist.userId)
			throw new Error("You are not allowed to update this playlist") // TODO: return something instead?
		return this.storageService.musicPlaylistCollection.deleteOne({ _id: +id })
	}
}
