import { Component } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-add-person",
	templateUrl: "./add-person.component.html",
	styleUrls: ["./add-person.component.scss", "../../../styles/popup-box.scss"],
})
export class AddPersonComponent {
	person: Person = {
		_id: 0,
		name: "",
		information: [{ title: "Født", content: "" }, { title: "Død", content: "" }],
		relations: [],
	}

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	deleteInformation(row: { title: string, content: string }) {
		const index = this.person.information.indexOf(row)
		this.person.information.splice(index, 1)
	}

	addInformation() {
		this.person.information.push({ title: "", content: "" })
	}

	async add() {
		await this.ancestryService.add(this.person)
		this.navigationService.closeOverlay()
	}
}
