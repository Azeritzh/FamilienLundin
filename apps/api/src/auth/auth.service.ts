import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User, UserService } from "../user/user.service"
import * as bcrypt from "bcrypt"
import { jwtConstants } from "./constants"

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService
	) { }

	async validateUser(username: string, password: string) {
		const user = await this.userService.findOne(username)
		return await this.isMatch(password, user?.passwordHash)
			? user
			: null
	}

	private async isMatch(password: string, hash: string) {
		if (!hash)
			return false
		return await bcrypt.compare(password, hash)
	}

	createJwtTokenCookie(user: User) {
		const payload: JwtPayload = { username: user.username, sub: user._id }
		const token = this.jwtService.sign(payload)
		
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.accessExpiration}`
	}
}

export interface JwtPayload {
	username: string,
	sub: number
}
