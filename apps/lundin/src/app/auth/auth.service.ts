import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"

@Injectable()
export class AuthService {
	user
	jwtToken: string

	constructor(private http: HttpClient) {
		// this.jwtToken = localStorage.getItem("jwtToken")
		// this.verifyExpiration()
	}

	private verifyExpiration() {
		if (!this.jwtToken)
			return
		const payload = this.decodePayload(this.jwtToken)
		const expirationDate = new Date(payload.exp)
		if (expirationDate.getTime() < new Date().getTime())
			this.logout()
	}

	private decodePayload(token: string) {
		const encodedPayload = token.split(".")[1]
		return JSON.parse(atob(encodedPayload))
	}

	async login(username: string, password: string) {
		this.user = await this.http
			.post<{ _id: number }>("/api/auth/login", { username, password })
			.toPromise()
	}

	async refresh() {
		this.user = await this.http
			.get<{ _id: number }>("/api/auth/refresh")
			.toPromise()
	}

	logout() {
		// localStorage.removeItem("jwtToken")
		this.user = null
	}

	createUser(username: string) {
		this.http.post("/api/user/create", { name: username, password: "test" }).toPromise()
	}

	isLoggedIn(){
		return !!this.user
	}
}
