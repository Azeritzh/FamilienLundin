import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User, UserService } from "../user/user.service"
import { jwtConstants } from "./constants"
import { expirationFrom, passwordMatches, refreshTokenMatches } from "./hashing"

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService
	) { }

	async validateUser(username: string, password: string) {
		const user = await this.userService.findOne({ username })
		return await passwordMatches(password, user?.passwordHash)
			? user
			: null
	}

	async validateRefreshToken(userId: number, token: string) {
		const user = await this.userService.findOne({ _id: userId })
		const hashedToken = user.refreshTokens?.[expirationFrom(token)]
		return await refreshTokenMatches(token, hashedToken)
			? user
			: null
	}

	createAccessToken(user: User) {
		const payload: JwtPayload = { sub: user._id }
		return this.jwtService.sign(payload)
	}

	getAccessTokenCookie(token: string) {
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.accessExpiration}`
	}

	createRefreshToken(user: User) {
		const payload: JwtPayload = { sub: user._id }
		return this.jwtService.sign(payload, {
			secret: jwtConstants.refreshSecret,
			expiresIn: jwtConstants.refreshExpiration,
		})
	}

	getRefreshTokenCookie(token: string, refreshUrl: string) {
		return `Refresh=${token}; HttpOnly; Path=/${refreshUrl}; Max-Age=${jwtConstants.refreshExpiration}`
	}

	getLogoutCookies() {
		return [
			"Authentication=; HttpOnly; Path=/; Max-Age=0",
			"Refresh=; HttpOnly; Path=/; Max-Age=0",
		]
	}
}

export interface JwtPayload { sub: number }
