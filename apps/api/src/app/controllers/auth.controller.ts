import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { AuthService } from "../../auth/auth.service"
import { RefreshJwtAuthGuard } from "../../auth/refresh-token.strategy"
import { StorageService } from "../../storage/storage.service"
import { User, UserService } from "../../user/user.service"

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly storageService: StorageService
	) { }

	@Get("add-basic")
	async addBasic() {
		const users = this.storageService.getCollection("users")
		if (users.count() > 0)
			return "lolno"
		await this.userService.addUser("Test", "test")
		this.storageService.saveCollections()
		return "Added user \"Test\" with password \"test\""
	}

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(@Req() request: Request) {
		const user: User = <User>request.user
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.createAccessTokenCookie(accessToken)
		const refreshToken = this.authService.createRefreshToken(user)
		const refreshCookie = this.authService.createRefreshTokenCookie(refreshToken, "api/auth/refresh")
		this.userService.updateRefreshTokenHash(user._id, refreshToken)
		request.res.setHeader("Set-Cookie", [accessCookie, refreshCookie])
		return user._id
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Get("refresh")
	async refresh(@Req() request: Request) {
		request.cookies?.Refresh

		const user: User = <User>request.user
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.createAccessTokenCookie(accessToken)

		request.res.setHeader("Set-Cookie", accessCookie)
		return request.user
	}
}
