import { Component } from "@angular/core"
import { PersonalRelation } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-edit-relations",
	templateUrl: "./edit-relations.component.html",
	styleUrls: ["./edit-relations.component.scss", "../../../styles/popup-box.scss"],
})
export class EditRelationsComponent {
	personId: number
	relations: PersonalRelation[] = [{ type: "child", id: 0 }]

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	editPerson(personId: number) {
		this.personId = personId
		const person = this.ancestryService.person(personId)
		this.relations = person.relations.map(x => ({ ...x }))
	}

	deleteRelation(relation: PersonalRelation) {
		const index = this.relations.indexOf(relation)
		this.relations.splice(index, 1)
	}

	addRelation() {
		this.relations.push({ type: "child", id: 0 })
	}

	async save() {
		await this.ancestryService.updateRelations(this.personId, this.relations)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
