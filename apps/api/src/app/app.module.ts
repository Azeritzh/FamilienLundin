import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "../auth/auth.module"
import { MediaModule } from "../media/media.module"
import { StorageModule } from "../storage/storage.module"
import { UserModule } from "../user/user.module"
import { AncestryController } from "./controllers/ancestry.controller"
import { AuthController } from "./controllers/auth.controller"
import { CalendarController } from "./controllers/calendar.controller"
import { CryptController } from "./controllers/crypt.controller"
import { MessageController } from "./controllers/message.controller"
import { MinestrygerController } from "./controllers/minestryger.controller"
import { MusicController } from "./controllers/music.controller"
import { RecipeController } from "./controllers/recipe.controller"
import { UserController } from "./controllers/user.controller"
import { VideoController } from "./controllers/video.controller"
import { APP_FILTER } from "@nestjs/core"
import { NotFoundExceptionFilter } from "./filters/not-found-exception.filter"

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "lundin"),
		}),
		AuthModule,
		MediaModule,
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
		MusicController,
		RecipeController,
		UserController,
		VideoController,
	],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter, // Handle unmatched routes
    },
  ],
})
export class AppModule { }
