import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { UserModule } from "../user/user.module"
import { AuthService } from "./auth.service"
import { jwtConstants } from "./constants"
import { JwtStrategy } from "./jwt.strategy"
import { LocalStrategy } from "./local.strategy"
import { RefreshJwtStrategy } from "./refresh-token.strategy"

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.accessSecret,
			signOptions: { expiresIn: jwtConstants.accessExpiration },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
	exports: [AuthService],
})
export class AuthModule { }
