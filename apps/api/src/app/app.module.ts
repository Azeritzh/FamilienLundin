import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "../auth/auth.module"
import { StorageModule } from "../storage/storage.module"
import { UserModule } from "../user/user.module"
import { AppController } from "./controllers/app.controller"
import { AuthController } from "./controllers/auth.controller"
import { AppService } from "./app.service"

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "lundin"),
		}),
		AuthModule,
		StorageModule,
		UserModule,
	],
	controllers: [AppController, AuthController],
	providers: [AppService],
})
export class AppModule { }
