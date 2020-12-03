import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Request } from "express"
import { User } from "../user/user.service"
import { JwtPayload } from "./auth.service"
import { jwtConstants } from "./constants"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: (request: Request) => request?.cookies?.Authentication,
			secretOrKey: jwtConstants.secret,
		})
	}

	async validate(payload: JwtPayload): Promise<User> {
		return { _id: payload.sub, username: payload.username, passwordHash: "" }
	}
}
