import { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post } from "@nestjs/common"
import { StorageService } from "./storage/storage.service"

@Controller()
export class AppController {
	constructor(
		private readonly storageService: StorageService,
	) { }

	@Get("getData")
	getData(): Message {
		const collection = this.storageService.getCollection("hej du")
		return <Message><unknown>collection.findOne()
	}

	@Post("saveData")
	saveData(@Body() message: Message): Message {
		const collection = this.storageService.getCollection("hej du")
		const newMessage = collection.insertOne(message)
		this.storageService.saveCollections()
		return newMessage
	}
}
