import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "@lundin/api-interfaces"
import { BehaviorSubject, firstValueFrom } from "rxjs"
import { AuthService } from "./auth.service"

@Injectable({
	providedIn: "root",
})
export class UserService {
	users$ = new BehaviorSubject<User[]>([])

	constructor(
		private http: HttpClient,
		authService: AuthService,
	) {
		authService.onLogin.subscribe(() => this.getUsers())
	}

	async getUsers() {
		const users = await firstValueFrom(this.http.get<User[]>("api/user/get-all"))
		this.users$.next(users)
	}
}
