import { AuthResponse } from "@lundin/api-interfaces"
import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { AuthService } from "../../auth/auth.service"
import { jwtConstants } from "../../auth/constants"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
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
	async login(@Req() request: RequestWithUser): Promise<AuthResponse> {
		const user = request.user
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.getAccessTokenCookie(accessToken)
		const refreshToken = this.authService.createRefreshToken(user)
		const refreshCookie = this.authService.getRefreshTokenCookie(refreshToken, "api/auth/refresh")
		await this.userService.updateRefreshTokenHash(user._id, refreshToken)
		request.res.setHeader("Set-Cookie", [accessCookie, refreshCookie])
		return { userId: user._id, expiration: this.getExpirationDate() }
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Get("refresh")
	async refresh(@Req() request: RequestWithUser): Promise<AuthResponse> {
		const user = request.user
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.getAccessTokenCookie(accessToken)
		request.res.setHeader("Set-Cookie", accessCookie)
		return { userId: user._id, expiration: this.getExpirationDate() }
	}

	@UseGuards(JwtAuthGuard)
	@Get("logout")
	async logout(@Req() request: RequestWithUser) {
		await this.userService.clearRefreshTokenHash(request.user._id)
		request.res.setHeader("Set-Cookie", this.authService.getLogoutCookies())
	}

	private getExpirationDate() {
		const secondsSinceEpoch = new Date().getTime() / 1000
		return secondsSinceEpoch + jwtConstants.accessExpiration
	}
}

interface RequestWithUser extends Request {
	user: User
}
