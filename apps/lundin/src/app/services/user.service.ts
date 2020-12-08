import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class UserService {
	users$ = new BehaviorSubject<User[]>([])

	constructor(private http: HttpClient) {
		this.getUsers()
	}

	async getUsers() {
		const users = await this.http.get<User[]>("api/user/get-all").toPromise()
		this.users$.next(users)
	}
}
