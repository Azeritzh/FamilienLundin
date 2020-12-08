import { Message, MessageThread } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import { RequestWithUser } from "./auth.controller"

@Controller("message")
export class MessageController {
	constructor(
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("getThreads")
	async getThreads(@Req() request: RequestWithUser) {
		const userId = request.user._id
		const threads = this.storageService.messageCollection.find()
		return threads.filter(x => x.participantIds.includes(userId))
	}

	@UseGuards(JwtAuthGuard)
	@Post("addThread")
	async addThread(@Req() request: RequestWithUser, @Body() thread: MessageThread) {
		thread.authorId = request.user._id
		return this.storageService.messageCollection.insertOne(thread)
	}

	@UseGuards(JwtAuthGuard)
	@Post("getFullThread")
	async getFullThread(@Body() message: { threadId: number }) {
		return this.storageService.messageCollection.findOne({ _id: message.threadId })
	}

	@UseGuards(JwtAuthGuard)
	@Post("addResponse")
	async addResponse(@Req() request: RequestWithUser, @Body() message: { threadId: number, message: Message }) {
		message.message.authorId = request.user._id
		return this.storageService.messageCollection.updateOne({ _id: message.threadId}, x => x.responses.push(message.message))
	}
}
