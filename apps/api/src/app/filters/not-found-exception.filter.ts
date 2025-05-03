import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from "@nestjs/common"
import { Response } from "express"
import { join } from "path"

// AI generated
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Check if the request is for an API route
    if (request.url.startsWith("/api")) {
      response.status(404).json({ message: "API route not found" })
    } else {
      // Serve the Angular app's index.html for non-API routes
      response.sendFile(join(__dirname, "..", "lundin", "index.html"))
    }
  }
}
