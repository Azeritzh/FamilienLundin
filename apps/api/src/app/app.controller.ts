import { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { AuthService } from "../auth/auth.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { StorageService } from "./storage/storage.service"

@Controller()
export class AppController {
	constructor(
		private readonly authService: AuthService,
		private readonly storageService: StorageService
	) { }

	@UseGuards(AuthGuard("local"))
	@Post("auth/login")
	async login(@Request() req) {
		return this.authService.createLoginToken(req.user)
	}

	@UseGuards(JwtAuthGuard)
	@Get("getData")
	getData(): Message {
		const collection = this.storageService.getCollection("hej du")
		return <Message>(<unknown>collection.findOne())
	}

	@UseGuards(JwtAuthGuard)
	@Post("saveData")
	saveData(@Body() message: Message): Message {
		const collection = this.storageService.getCollection("hej du")
		const newMessage = collection.insertOne(message)
		this.storageService.saveCollections()
		return newMessage
	}
}
