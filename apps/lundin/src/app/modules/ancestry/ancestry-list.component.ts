import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { AncestryService } from "./ancestry.service"

@Component({
	selector: "lundin-ancestry-list",
	templateUrl: "./ancestry-list.component.html",
	styleUrls: ["./ancestry-list.component.scss"],
})
export class AncestryListComponent {
	people: Person[]

	constructor(private ancestryService: AncestryService) {
		ancestryService.load().then(people => this.people = people)
	}

	add() {
		const person: Person = {
			_id: 0,
			name: "Jørgen",
			information: { "død": "nu", "alder": "101" },
			childIds: []
		}
		this.ancestryService.add(person)
	}
}
