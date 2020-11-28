import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User, UserService } from "../user/user.service"
import * as bcrypt from "bcrypt"

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

	async createLoginToken(user: User) {
		const payload: JwtPayload = { username: user.username, sub: user._id }
		return { access_token: this.jwtService.sign(payload) }
	}
}

export interface JwtPayload {
	username: string,
	sub: number
}
