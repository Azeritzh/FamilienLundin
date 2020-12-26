import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { NavigationService } from "../../../services/navigation.service"
import { AddPersonComponent } from "../add-person/add-person.component"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-ancestry-list",
	templateUrl: "./ancestry-list.component.html",
	styleUrls: ["./ancestry-list.component.scss"],
})
export class AncestryListComponent {
	people$: Observable<Person[]>

	constructor(
		ancestryService: AncestryService,
		private navigationService: NavigationService,
	) {
		this.people$ = ancestryService.load()
	}

	add() {
		this.navigationService.openAsOverlay(AddPersonComponent)
	}
}
