import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Message } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	hello$ = this.http.get<Message>("/api/hello")
	header = "Familien Lundin"
	navigationEntries: NavigationEntry[] = [
		{ text: "Hjem", link: "/" },
		{ text: "Kalender", link: "/" },
		{ text: "Familie", link: "/" },
		{ text: "Galleri", link: "/" },
		{ text: "Opskrifter", link: "/" },
		{ text: "Spil", link: "/games" },
	]

	constructor(private http: HttpClient) { }
}

interface NavigationEntry {
	text: string
	link: string
}
