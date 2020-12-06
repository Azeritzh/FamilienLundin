import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { Strategy } from "passport-jwt"
import { AuthService, JwtPayload } from "./auth.service"
import { jwtConstants } from "./constants"

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
	constructor(
		private authService: AuthService,
	) {
		super({
			jwtFromRequest: (request: Request) => request?.cookies?.Refresh,
			secretOrKey: jwtConstants.refreshSecret,
			passReqToCallback: true,
		})
	}

	async validate(request: Request, payload: JwtPayload) {
		const user = await this.authService.validateRefreshToken(payload.sub, request.cookies?.Refresh)
		if (!user)
			throw new UnauthorizedException()
		return { _id: user._id, username: user.username }
	}
}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard("jwt-refresh-token") { }
