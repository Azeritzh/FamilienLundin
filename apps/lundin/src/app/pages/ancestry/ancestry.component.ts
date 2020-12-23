import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-ancestry",
	templateUrl: "./ancestry.component.html",
	styleUrls: ["./ancestry.component.scss"]
})
export class AncestryComponent {
	persons

	constructor(private httpClient: HttpClient) {
		this.persons = httpClient.get<Person[]>("api/ancestry/load-all")
	}

	add() {
		const person: Person = {
			_id: 0,
			name: "Jørgen",
			information: { "død": "nu", "alder": "101" },
			childIds: []
		}
		this.httpClient.post("api/ancestry/add", person)
			.toPromise()
	}
}
