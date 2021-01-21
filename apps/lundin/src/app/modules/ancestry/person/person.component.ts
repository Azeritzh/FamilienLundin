import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { NavigationService } from "../../../services/navigation.service"
import { AddFileComponent } from "../add-file/add-file.component"
import { AncestryService } from "../ancestry.service"
import { EditInfoComponent } from "../edit-info/edit-info.component"

@Component({
	selector: "lundin-person",
	templateUrl: "./person.component.html",
	styleUrls: ["./person.component.scss"],
})
export class PersonComponent implements OnInit {
	personId: number
	person$: Observable<Person>

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.personId = +params.get("id")
			this.person$ = this.ancestryService.person$(this.personId)
		})
	}

	async editRelations(){
		throw new Error("not implemented")
	}

	async editInfo(){
		const component = await this.navigationService.openAsOverlay(EditInfoComponent)
		component.editPerson(this.personId)
	}

	async editFiles(){
		const component = await this.navigationService.openAsOverlay(AddFileComponent)
		component.personId = this.personId
	}
}
