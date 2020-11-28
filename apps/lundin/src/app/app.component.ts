import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Message } from "@lundin/api-interfaces"
import { AuthService } from "./auth/auth.service"

@Component({
	selector: "lundin-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	header = "Familien Lundin"
	navigationEntries: NavigationEntry[] = [
		{ text: "Hjem", link: "/" },
		{ text: "Kalender", link: "/" },
		{ text: "Familie", link: "/" },
		{ text: "Galleri", link: "/" },
		{ text: "Opskrifter", link: "/" },
		{ text: "Spil", link: "/games" },
	]

	constructor(
		private authService: AuthService,
		private http: HttpClient
	) { }

	async get() {
		const message = await this.http.get<Message>("/api/getData").toPromise()
		console.log(message)
	}

	add() {
		this.http
			.post<Message>("/user/create", { message: "wahey" })
			.toPromise()
	}

	login() {
		this.authService.login()
	}
}

interface NavigationEntry {
	text: string
	link: string
}
