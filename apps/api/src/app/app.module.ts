import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "../auth/auth.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { StorageService } from "./storage/storage.service"

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "lundin"),
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService, StorageService],
})
export class AppModule { }
