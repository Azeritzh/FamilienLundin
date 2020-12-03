import type { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common"
import { Response } from "express"
import { AuthGuard } from "@nestjs/passport"
import { AuthService } from "../auth/auth.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { StorageService } from "../storage/storage.service"
import { UserService } from "../user/user.service"

@Controller()
export class AppController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly storageService: StorageService
	) { }

	@Get("auth/add-basic")
	async addBasic() {
		const users = this.storageService.getCollection("users")
		if (users.count() > 0)
			return "lolno"
		await this.userService.addUser("Test", "test")
		this.storageService.saveCollections()
		return "Added user \"Test\" with password \"test\""
	}

	@UseGuards(JwtAuthGuard)
	@Post("user/create")
	async create(@Body() newUser: { name: string, password: string }) {
		await this.userService.addUser(newUser.name, newUser.password)
		this.storageService.saveCollections()
		return "success"
	}

	@UseGuards(AuthGuard("local"))
	@Post("auth/login")
	async login(@Request() req, @Res() response: Response) {
		const cookie = this.authService.createJwtTokenCookie(req.user)
		response.setHeader("Set-Cookie", cookie)
		return response.send(req.user)
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
