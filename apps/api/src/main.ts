import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import cookieParser from "cookie-parser"
import { json } from "express"
import { AppModule } from "./app/app.module"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const globalPrefix = "api"
	app.setGlobalPrefix(globalPrefix)
	app.use(cookieParser())
	app.use(json({ limit: '5mb' }))
	const port = process.env.PORT || 3333
	await app.listen(port, () => {
		Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix)
	})
}

bootstrap()
