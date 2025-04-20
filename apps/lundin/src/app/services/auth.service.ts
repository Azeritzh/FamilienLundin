import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthResponse } from "@lundin/api-interfaces"
import { firstValueFrom, ReplaySubject, Subject } from "rxjs"

@Injectable()
export class AuthService {
	onLogin = new ReplaySubject<void>(1)
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
		return 0 < this.secondsToExpiration(loginInfo.expiration)
	}

	private secondsToExpiration(expiration: number = this.loginInfo.expiration) {
		const secondsSinceEpoch = new Date().getTime() / 1000
		return expiration - secondsSinceEpoch
	}

	async login(username: string, password: string) {
		this.loginInfo = await firstValueFrom(this.http.post<AuthResponse>("/api/auth/login", { username, password }))
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return null
			})
		if (this.isLoggedIn())
			this.handleSuccessfulLogin()
		return this.isLoggedIn()
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
		this.loginInfo = await firstValueFrom(this.http.get<AuthResponse>("/api/auth/refresh"))
			.catch(error => {
				console.log("failed login: " + JSON.stringify(error))
				return error.status === 401 ? null : this.loginInfo // returning old loginInfo if it may be due to error
			})
		this.onRefreshResponse.next(this.isLoggedIn())
		if (this.isLoggedIn())
			this.handleSuccessfulLogin(wasLoggedIn)
	}

	async logout() {
		await firstValueFrom(this.http.get("/api/auth/refresh/logout"))
		this.clearLoginInfo()
	}

	private clearLoginInfo() {
		this.loginInfo = null
		localStorage.removeItem("loginInfo")
	}

	addUser(username: string) {
		firstValueFrom(this.http.post("/api/user/add", { username }))
	}

	resetPasswordFor(username: string) {
		firstValueFrom(this.http.post("/api/auth/reset", { username }))
	}

	isLoggedIn() {
		return !!this.loginInfo
	}

	isAdmin() {
		return this.loginInfo?.type === "admin"
	}
}
