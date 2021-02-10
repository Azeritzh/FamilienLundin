import type { Message, MessageThread } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import type { RequestWithUser } from "./auth.controller"

@Controller("message")
export class MessageController {
	constructor(private readonly storageService: StorageService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-threads")
	async getThreads(@Req() request: RequestWithUser) {
		const userId = request.user._id
		const threads = this.storageService.messageCollection.find()
		return threads.filter(this.showForUser(userId))
	}

	private showForUser = (userId: number) => (thread: MessageThread) => {
		return thread.participantIds.length === 0 || thread.participantIds.includes(userId)
	}

	@UseGuards(JwtAuthGuard)
	@Post("add-thread")
	async addThread(@Req() request: RequestWithUser, @Body() thread: MessageThread) {
		thread.authorId = request.user._id
		return this.storageService.messageCollection.insertOne(thread)
	}

	@UseGuards(JwtAuthGuard)
	@Post("get-full-thread")
	async getFullThread(@Body() message: { threadId: number }) {
		return this.storageService.messageCollection.findOne({ _id: message.threadId })
	}

	@UseGuards(JwtAuthGuard)
	@Post("add-response")
	async addResponse(@Req() request: RequestWithUser, @Body() message: { threadId: number, message: Message }) {
		message.message.authorId = request.user._id
		return this.storageService.messageCollection.updateOne({ _id: message.threadId }, x => x.responses.push(message.message))
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-thread")
	async updateThread(@Body() message: { threadId: number, title: string, content: string }) {
		return this.storageService.messageCollection.updateOne(
			{ _id: message.threadId },
			x => {
				x.title = message.title
				x.content = message.content
			}
		)
	}
}
