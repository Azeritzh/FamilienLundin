import { HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthService } from "./auth.service"

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler) {
		if (this.authService.jwtToken)
			request = this.addTokenTo(request)
		return next.handle(request)
	}

	private addTokenTo(request: HttpRequest<any>) {
		return request.clone({
			setHeaders: { Authorization: ` Bearer ${this.authService.jwtToken}` },
		})
	}
}

export const jwtInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: JwtInterceptor,
	multi: true,
}
