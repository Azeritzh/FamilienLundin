import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Message } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
	constructor(private http: HttpClient) { }

	async get() {
		const message = await this.http.get<Message>("/api/getData").toPromise()
		console.log(message)
	}

	add() {
		this.http
			.post<Message>("/api/saveData", { message: "wahey" })
			.toPromise()
	}
}
