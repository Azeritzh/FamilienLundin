import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "../auth/auth.module"
import { StorageModule } from "../storage/storage.module"
import { UserModule } from "../user/user.module"
import { AncestryController } from "./controllers/ancestry.controller"
import { AuthController } from "./controllers/auth.controller"
import { CalendarController } from "./controllers/calendar.controller"
import { CryptController } from "./controllers/crypt.controller"
import { MessageController } from "./controllers/message.controller"
import { MinestrygerController } from "./controllers/minestryger.controller"
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
		AncestryController,
		AuthController,
		CalendarController,
		CryptController,
		MessageController,
		MinestrygerController,
		UserController,
	],
})
export class AppModule { }
