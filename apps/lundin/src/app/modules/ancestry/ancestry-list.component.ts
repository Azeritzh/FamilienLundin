import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { NavigationService } from "../../services/navigation.service"
import { AddPersonComponent } from "./add-person/add-person.component"
import { AncestryService } from "./ancestry.service"

@Component({
	selector: "lundin-ancestry-list",
	templateUrl: "./ancestry-list.component.html",
	styleUrls: ["./ancestry-list.component.scss"],
})
export class AncestryListComponent {
	people: Person[]

	constructor(
		ancestryService: AncestryService,
		private navigationService: NavigationService,
	) {
		ancestryService.load().then(people => this.people = people)
	}

	add() {
		this.navigationService.openAsOverlay(AddPersonComponent)
	}
}
