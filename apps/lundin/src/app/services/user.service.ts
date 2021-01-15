import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"
import { AuthService } from "./auth.service"

@Injectable()
export class UserService {
	users$ = new BehaviorSubject<User[]>([])

	constructor(
		private http: HttpClient,
		private authService: AuthService,
	) {
		this.getUsers()
		authService.onRefreshResponse.subscribe(loggedIn => {
			if (loggedIn)
				this.getUsers()
		})
	}

	async getUsers() {
		const users = await this.http.get<User[]>("api/user/get-all").toPromise()
		this.users$.next(users)
	}
}
