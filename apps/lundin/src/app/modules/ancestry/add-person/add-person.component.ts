import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { PersonalRelation } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { LabellingDirective } from "../../../shared/directives/labelling.directive"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-add-person",
	templateUrl: "./add-person.component.html",
	styleUrls: ["./add-person.component.scss", "../../../styles/popup-box.scss"],
	imports: [
		CommonModule,
		FormsModule,
		LabellingDirective,
	],
})
export class AddPersonComponent {
	name = ""
	gender: "male" | "female" | "other" = "male"
	born = ""
	dead = ""
	relations: PersonalRelation[] = [{ type: "child", id: 0 }]

	constructor(
		public ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	deleteRelation(relation: PersonalRelation) {
		const index = this.relations.indexOf(relation)
		this.relations.splice(index, 1)
	}

	addRelation() {
		this.relations.push({ type: "child", id: 0 })
	}

	async add() {
		await this.ancestryService.add({
			_id: 0,
			name: this.name,
			gender: this.gender,
			relations: this.relations.filter(x => x.id),
			information: [{ title: "__born", content: this.born }, { title: "__dead", content: this.dead }],
			files: [],
		})
		this.navigationService.closeOverlay()
	}

	closePopup() {
		this.navigationService.closeOverlay()
	}
}
