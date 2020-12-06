import { AuthResponse } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { AuthService, BasicUserInfo } from "../../auth/auth.service"
import { jwtConstants } from "../../auth/constants"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { RefreshJwtAuthGuard } from "../../auth/refresh-token.strategy"
import { UserService } from "../../user/user.service"

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) { }

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(@Req() request: RequestWithUser): Promise<AuthResponse> {
		const user = await this.userService.findOne({ _id: request.user._id })
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.getAccessTokenCookie(accessToken)
		const refreshToken = this.authService.createRefreshToken(user)
		const refreshCookie = this.authService.getRefreshTokenCookie(refreshToken, "api/auth/refresh")
		await this.userService.updateRefreshTokenHash(user._id, refreshToken)
		request.res.setHeader("Set-Cookie", [accessCookie, refreshCookie])
		return { userId: user._id, expiration: this.getExpirationDate(), username: user.username, type: user.type }
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Get("refresh")
	async refresh(@Req() request: RequestWithUser): Promise<AuthResponse> {
		const user = await this.userService.findOne({ _id: request.user._id })
		const accessToken = this.authService.createAccessToken(user)
		const accessCookie = this.authService.getAccessTokenCookie(accessToken)
		const refreshToken = this.authService.createRefreshToken(user)
		const refreshCookie = this.authService.getRefreshTokenCookie(refreshToken, "api/auth/refresh")
		await this.userService.clearRefreshToken(user._id, request.cookies.Refresh)
		await this.userService.updateRefreshTokenHash(user._id, refreshToken)
		request.res.setHeader("Set-Cookie", [accessCookie, refreshCookie])
		return { userId: user._id, expiration: this.getExpirationDate(), username: user.username, type: user.type }
	}

	private getExpirationDate() {
		const secondsSinceEpoch = new Date().getTime() / 1000
		return secondsSinceEpoch + jwtConstants.accessExpiration
	}

	@UseGuards(JwtAuthGuard)
	@Get("refresh/logout")
	async logout(@Req() request: RequestWithUser) {
		await this.userService.clearRefreshToken(request.user._id, request.cookies.Refresh)
		request.res.setHeader("Set-Cookie", this.authService.getLogoutCookies())
	}

	@UseGuards(JwtAuthGuard)
	@Post("change")
	async changePassword(@Req() request: RequestWithUser, @Body() message: { blob: string }) {
		const decoded = Buffer.from(message.blob, "base64").toString("utf-8")
		const { password, newPassword } = JSON.parse(decoded)
		const user = await this.authService.validateUser(request.user.username, password)
		if (!user)
			throw new UnauthorizedException()
		await this.userService.updatePassword(user._id, newPassword)
		return { success: true }
	}
}

export interface RequestWithUser extends Request {
	user: BasicUserInfo
}
