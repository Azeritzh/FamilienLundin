import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"

@Injectable()
export class AuthService {
	jwtToken: string

	constructor(private http: HttpClient) {
		this.jwtToken = localStorage.getItem("jwtToken")
	}

	async login() {
		const response = await this.http
			.post<{ access_token: string }>("/api/auth/login", { username: "Test", password: "test" })
			.toPromise()
		this.jwtToken = response.access_token
		localStorage.setItem("jwtToken", this.jwtToken)
	}

	logout() {
		localStorage.removeItem("jwtToken")
		this.jwtToken = null
	}
}
