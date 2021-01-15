import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthResponse } from "@lundin/api-interfaces"
import { Subject } from "rxjs"

@Injectable()
export class AuthService {
	onRefreshResponse = new Subject<boolean>()
	loginInfo: AuthResponse

	constructor(private http: HttpClient) {
		this.loadLoginInfoFromStorage()
		this.verifyExpiration()
		if (this.loginInfo)
			this.startRefreshTimer()
		else
			this.refresh()
	}

	private loadLoginInfoFromStorage() {
		const storedInfo = localStorage.getItem("loginInfo")
		if (storedInfo)
			this.loginInfo = JSON.parse(storedInfo)
	}

	private verifyExpiration() {
		if (this.loginInfo && this.isLoginExpired())
			this.clearLoginInfo()
	}

	private startRefreshTimer() {
		setTimeout(() => this.refresh(), (this.secondsToExpiration() - 60) * 1000)
	}

	private isLoginExpired() {
		return this.secondsToExpiration() <= 0
	}

	private secondsToExpiration() {
		const secondsSinceEpoch = new Date().getTime() / 1000
		const expiration = this.loginInfo.expiration
		return expiration - secondsSinceEpoch
	}

	private clearLoginInfo() {
		this.loginInfo = null
		localStorage.removeItem("loginInfo")
	}

	async login(username: string, password: string) {
		this.loginInfo = await this.http
			.post<AuthResponse>("/api/auth/login", { username, password })
			.toPromise()
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return null
			})
		if (this.loginInfo) {
			localStorage.setItem("loginInfo", JSON.stringify(this.loginInfo))
			this.startRefreshTimer()
		}
	}

	async refresh() {
		this.loginInfo = await this.http
			.get<AuthResponse>("/api/auth/refresh")
			.toPromise()
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return null
			})
		this.onRefreshResponse.next(!!this.loginInfo)
		if (this.loginInfo) {
			localStorage.setItem("loginInfo", JSON.stringify(this.loginInfo))
			this.startRefreshTimer()
		}
	}

	async logout() {
		await this.http
			.get("/api/auth/refresh/logout")
			.toPromise()
		this.clearLoginInfo()
	}

	addUser(username: string) {
		this.http.post("/api/user/add", { username }).toPromise()
	}

	resetPasswordFor(username: string) {
		this.http.post("/api/auth/reset", { username }).toPromise()
	}

	isLoggedIn() {
		return !!this.loginInfo
	}

	isAdmin() {
		return this.loginInfo?.type === "admin"
	}
}
