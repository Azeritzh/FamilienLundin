import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "../auth/auth.module"
import { StorageModule } from "../storage/storage.module"
import { UserModule } from "../user/user.module"
import { AppService } from "./app.service"
import { AppController } from "./controllers/app.controller"
import { AuthController } from "./controllers/auth.controller"
import { CryptController } from "./controllers/crypt.controller"
import { UserController } from "./controllers/user.controller"

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "lundin"),
		}),
		AuthModule,
		StorageModule,
		UserModule,
	],
	controllers: [
		AppController,
		AuthController,
		CryptController,
		UserController,
	],
	providers: [AppService],
})
export class AppModule { }
