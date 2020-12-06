import { Injectable } from "@nestjs/common"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Request } from "express"
import { StoredUser, UserService } from "../user/user.service"
import { JwtPayload } from "./auth.service"
import { jwtConstants } from "./constants"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UserService,
	) {
		super({
			jwtFromRequest: (request: Request) => request?.cookies?.Authentication,
			secretOrKey: jwtConstants.accessSecret,
		})
	}

	async validate(payload: JwtPayload): Promise<StoredUser> {
		return this.userService.findOne({ _id: payload.sub }) // TODO: return just stuff in the jwt
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") { }
