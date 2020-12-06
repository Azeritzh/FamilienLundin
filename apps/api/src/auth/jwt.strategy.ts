import { Injectable } from "@nestjs/common"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Request } from "express"
import { BasicUserInfo, JwtPayload } from "./auth.service"
import { jwtConstants } from "./constants"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: (request: Request) => request?.cookies?.Authentication,
			secretOrKey: jwtConstants.accessSecret,
		})
	}

	async validate(payload: JwtPayload): Promise<BasicUserInfo> {
		return { _id: payload.sub, username: payload.username }
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") { }
