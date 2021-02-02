import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthResponse } from "@lundin/api-interfaces"
import { ReplaySubject, Subject } from "rxjs"

@Injectable()
export class AuthService {
	onLogin = new ReplaySubject(1)
	onRefreshResponse = new Subject<boolean>()
	loginInfo: AuthResponse

	constructor(private http: HttpClient) {
		this.initialiseLogin()
	}

	private initialiseLogin() {
		this.loadLoginInfoFromStorage()
		if (this.isLoggedIn())
			this.handleSuccessfulLogin()
		else
			this.refresh()
	}

	private loadLoginInfoFromStorage() {
		const storedInfo = JSON.parse(localStorage.getItem("loginInfo"))
		if (storedInfo && this.isCurrent(storedInfo))
			this.loginInfo = storedInfo
		else
			localStorage.removeItem("loginInfo")
	}

	private isCurrent(loginInfo: AuthResponse) {
		return this.secondsToExpiration(loginInfo.expiration) <= 0
	}

	private secondsToExpiration(expiration: number = this.loginInfo.expiration) {
		const secondsSinceEpoch = new Date().getTime() / 1000
		return expiration - secondsSinceEpoch
	}

	async login(username: string, password: string) {
		this.loginInfo = await this.http
			.post<AuthResponse>("/api/auth/login", { username, password })
			.toPromise()
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return null
			})
		if (this.isLoggedIn())
			this.handleSuccessfulLogin()
	}

	private handleSuccessfulLogin(wasLoggedIn = false) {
		if (!wasLoggedIn)
			this.onLogin.next()
		localStorage.setItem("loginInfo", JSON.stringify(this.loginInfo))
		this.startRefreshTimer()
	}

	private startRefreshTimer() {
		setTimeout(() => this.refresh(), (this.secondsToExpiration() - 60) * 1000)
	}

	async refresh() {
		const wasLoggedIn = this.isLoggedIn()
		this.loginInfo = await this.http
			.get<AuthResponse>("/api/auth/refresh")
			.toPromise()
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return null
			})
		this.onRefreshResponse.next(true)
		if (this.isLoggedIn())
			this.handleSuccessfulLogin(wasLoggedIn)
	}

	async logout() {
		await this.http
			.get("/api/auth/refresh/logout")
			.toPromise()
		this.clearLoginInfo()
	}

	private clearLoginInfo() {
		this.loginInfo = null
		localStorage.removeItem("loginInfo")
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
