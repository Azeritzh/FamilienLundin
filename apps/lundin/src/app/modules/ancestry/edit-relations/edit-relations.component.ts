
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { PersonalRelation } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-edit-relations",
	templateUrl: "./edit-relations.component.html",
	styleUrls: ["./edit-relations.component.scss", "../../../styles/popup-box.scss"],
	imports: [
    FormsModule
],
})
export class EditRelationsComponent {
	personId!: number
	relations: PersonalRelation[] = [{ type: "child", id: 0 }]

	constructor(
		public ancestryService: AncestryService,
		private navigationService: NavigationService,
		private router: Router,
	) { }

	editPerson(personId: number) {
		this.personId = personId
		const person = this.ancestryService.person(personId)
		this.relations = person?.relations.map(x => ({ ...x })) ?? []
	}

	deleteRelation(relation: PersonalRelation) {
		const index = this.relations.indexOf(relation)
		this.relations.splice(index, 1)
	}

	addRelation() {
		this.relations.push({ type: "child", id: 0 })
	}

	deletePerson() {
		this.ancestryService.delete(this.personId)
		this.navigationService.closeOverlay()
		this.router.navigateByUrl("ancestry")
	}

	async save() {
		await this.ancestryService.updateRelations(this.personId, this.relations.filter(x => x.id))
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
