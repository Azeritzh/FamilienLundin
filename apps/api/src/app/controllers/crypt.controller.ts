import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import { User } from "../../user/user.service"

@Controller("crypt")
export class CryptController {
	constructor(
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("load")
	async load(@Req() request: RequestWithUser) {
		const userId = request.user._id
		const crypts = this.storageService.getCollection("crypt")
		return crypts.findOne({ userId }) ?? ""
	}

	@UseGuards(JwtAuthGuard)
	@Post("save")
	async save(@Req() request: RequestWithUser, @Body() message: { encrypted: string }) {
		const userId = request.user._id
		const encrypted = message.encrypted
		const crypts = this.storageService.getCollection("crypt")
		const crypt = crypts.findOne({ userId })
		if (!crypt)
			crypts.insertOne({ userId, encrypted })
		else
			crypts.updateOne({ userId }, { encrypted })
	}
}

interface RequestWithUser extends Request {
	user: User
}
