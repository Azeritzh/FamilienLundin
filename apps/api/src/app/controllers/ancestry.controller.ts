import type { Person } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"

@Controller("ancestry")
export class AcnestryController {
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
}
