import { Injectable } from "@angular/core"
import { CanActivate, Router } from "@angular/router"
import { map } from "rxjs/operators"
import { AuthService } from "./auth.service"

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
	) { }

	canActivate() {
		if (this.authService.isLoggedIn())
			return true
		else
			return this.authService.onRefreshResponse.pipe(map(() => {
				if (this.authService.isLoggedIn())
					return true
				return this.router.parseUrl("/")
			}))
	}
}
