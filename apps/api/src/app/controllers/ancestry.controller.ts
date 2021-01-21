import type { Person } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"

@Controller("ancestry")
export class AncestryController {
	constructor(
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("load-all")
	async loadAll() {
		return this.storageService.ancestryCollection.find()
	}

	@UseGuards(JwtAuthGuard)
	@Post("add")
	async save(@Body() person: Person) {
		return this.storageService.ancestryCollection.insertOne(person)
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-info")
	async updateInfo(@Body() message: { personId: number, information: { title: string, content: string }[] }) {
		return this.storageService.ancestryCollection.updateOne(
			{ _id: message.personId },
			x => x.information = message.information
		)
	}

	@UseGuards(JwtAuthGuard)
	@Post("upload-file")
	@UseInterceptors(FileInterceptor("file", { dest: "./ancestry-uploads" }))
	async uploadFile(@UploadedFile() file, @Body() info: { description: string, personId: string }) {
		console.log(JSON.stringify(info))
		console.log(file)
		return { svar: "ja det" }
	}
}
