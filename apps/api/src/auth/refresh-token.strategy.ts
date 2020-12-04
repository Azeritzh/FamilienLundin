import { Injectable } from "@nestjs/common"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import * as bcrypt from "bcrypt"
import { Request } from "express"
import { Strategy } from "passport-jwt"
import { User, UserService } from "../user/user.service"
import { JwtPayload } from "./auth.service"
import { jwtConstants } from "./constants"

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
	constructor(
		private userService: UserService,
	) {
		super({
			jwtFromRequest: (request: Request) => request?.cookies?.Refresh,
			secretOrKey: jwtConstants.refreshSecret,
			passReqToCallback: true,
		})
	}

	async validate(request: Request, payload: JwtPayload): Promise<User> {
		const user = await this.userService.findOne({ _id: payload.sub })
		const refreshToken = request.cookies?.Refresh
		if (!refreshToken || !user?.refreshHash)
			return null
		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshHash)
		return refreshTokenMatches ? user : null
	}
}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard("jwt-refresh-token") { }
