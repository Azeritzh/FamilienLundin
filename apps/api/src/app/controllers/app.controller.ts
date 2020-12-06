import type { Message } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"

@Controller()
export class AppController {
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
