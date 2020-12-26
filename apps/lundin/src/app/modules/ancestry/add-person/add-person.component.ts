import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-add-person",
	templateUrl: "./add-person.component.html",
	styleUrls: ["./add-person.component.scss"],
})
export class AddPersonComponent {
	person: Person = {
		_id: 0,
		name: "",
		information: { "død": "nu", "alder": "101" },
		relations: [],
	}

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	async add() {
		await this.ancestryService.add(this.person)
		this.navigationService.closeOverlay()
	}
}
