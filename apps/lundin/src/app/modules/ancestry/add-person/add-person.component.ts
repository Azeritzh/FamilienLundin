import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-add-person",
	templateUrl: "./add-person.component.html",
	styleUrls: ["./add-person.component.scss", "../../../styles/popup-box.scss"],
})
export class AddPersonComponent {
	name = ""
	gender: "male" | "female" | "other" = "male"
	born = ""
	dead = ""
	information = [{ title: "Født", content: "" }, { title: "Død", content: "" }]
	relations = []

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	deleteInformation(row: { title: string, content: string }) {
		const index = this.information.indexOf(row)
		this.information.splice(index, 1)
	}

	addInformation() {
		this.information.push({ title: "", content: "" })
	}

	async add() {
		this.information.push({ title: "__born", content: this.born })
		this.information.push({ title: "__dead", content: this.dead })
		await this.ancestryService.add({
			_id: 0,
			name: this.name,
			gender: this.gender,
			relations: this.relations,
			information: this.information,
			files: [],
		})
		this.navigationService.closeOverlay()
	}
}
