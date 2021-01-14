import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-edit-info",
	templateUrl: "./edit-info.component.html",
	styleUrls: ["./edit-info.component.scss", "../../../styles/popup-box.scss"],
})
export class EditInfoComponent {
	personId: number
	information: { title: string, content: string }[] = []

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	editPerson(personId: number) {
		this.personId = personId
		const person = this.ancestryService.person(personId)
		this.information = person.information.map(x => ({ ...x }))
	}

	deleteInformation(row: { title: string, content: string }) {
		const index = this.information.indexOf(row)
		this.information.splice(index, 1)
	}

	addInformation() {
		this.information.push({ title: "", content: "" })
	}

	async save() {
		await this.ancestryService.updateInfo(this.personId, this.information)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
