import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import { UserService } from "../../user/user.service"
import type { RequestWithUser } from "./auth.controller"

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly storageService: StorageService,
	) { }

	@Get("add-basic")
	async addBasic() {
		const users = this.storageService.userCollection
		if (users.count() > 0)
			return "lolno"
		await this.userService.addUser("Test", "test")
		return "Added user \"Test\" with password \"test\""
	}

	@UseGuards(JwtAuthGuard)
	@Post("add")
	async addUser(@Req() request: RequestWithUser, @Body() message: { username: string }) {
		const currentUser = await this.userService.findOne({ _id: request.user._id })
		if (currentUser.type !== "admin")
			throw new UnauthorizedException()
		const newUser = await this.userService.addUser(message.username, "KristjanErSej")
		return { _id: newUser._id, username: newUser.username }
	}
}