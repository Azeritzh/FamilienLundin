import type { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { UserService } from "../../user/user.service"

@Controller()
export class AppController {
	constructor(private readonly userService: UserService) { }

	@UseGuards(JwtAuthGuard)
	@Post("user/create")
	async create(@Body() newUser: { name: string, password: string }) {
		await this.userService.addUser(newUser.name, newUser.password)
		return "success"
	}

	@UseGuards(JwtAuthGuard)
	@Get("getData")
	getData(): Message {
		return { message: "ja det" }
	}

	@UseGuards(JwtAuthGuard)
	@Post("saveData")
	saveData(@Body() message: Message): Message {
		return message
	}
}
