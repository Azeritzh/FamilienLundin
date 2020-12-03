import type { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import { UserService } from "../../user/user.service"

@Controller()
export class AppController {
	constructor(
		private readonly userService: UserService,
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Post("user/create")
	async create(@Body() newUser: { name: string, password: string }) {
		await this.userService.addUser(newUser.name, newUser.password)
		this.storageService.saveCollections()
		return "success"
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
