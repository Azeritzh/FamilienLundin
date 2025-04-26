import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-edit-info",
	templateUrl: "./edit-info.component.html",
	styleUrls: ["./edit-info.component.scss", "../../../styles/popup-box.scss"],
	standalone: false,
})
export class EditInfoComponent {
	personId!: number
	name = ""
	gender: "male" | "female" | "other" = "male"
	born = ""
	dead = ""
	information: { title: string, content: string }[] = []

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	editPerson(personId: number) {
		this.personId = personId
		const person = this.ancestryService.person(personId)!
		this.information = person.information
			.map(x => ({ ...x }))
			.filter(this.isCustom)
		this.born = person.information.find(x => x.title === "__born")?.content ?? ""
		this.dead = person.information.find(x => x.title === "__dead")?.content ?? ""
		this.name = person.name
		this.gender = person.gender
	}

	private isCustom(info: { title: string, content: string }) {
		return info.title !== "__born" && info.title !== "__dead"
	}

	deleteInformation(row: { title: string, content: string }) {
		const index = this.information.indexOf(row)
		this.information.splice(index, 1)
	}

	addInformation() {
		this.information.push({ title: "", content: "" })
	}

	async save() {
		const information = [
			{ title: "__born", content: this.born },
			{ title: "__dead", content: this.dead },
			...this.information
		]
		await this.ancestryService.updateInfo(this.personId, this.name, this.gender, information)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
