import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Person, PersonFile } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { NavigationService } from "../../../services/navigation.service"
import { AddFileComponent } from "../add-file/add-file.component"
import { AncestryService } from "../ancestry.service"
import { EditFileComponent } from "../edit-file/edit-file.component"
import { EditInfoComponent } from "../edit-info/edit-info.component"
import { EditRelationsComponent } from "../edit-relations/edit-relations.component"

@Component({
	selector: "lundin-person",
	templateUrl: "./person.component.html",
	styleUrls: ["./person.component.scss"],
})
export class PersonComponent implements OnInit {
	personId: number
	person$: Observable<Person>
	predefinedInfoTexts = {
		__born: "Født",
		__dead: "Død",
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
		private router: Router
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.personId = +params.get("id")
			this.person$ = this.ancestryService.person$(this.personId)
		})
	}

	async editRelations() {
		const component = await this.navigationService.openAsOverlay(EditRelationsComponent)
		component.editPerson(this.personId)
	}

	async seeAncestryTree() {
		this.router.navigateByUrl("/ancestry/tree/" + this.personId)
	}

	async editInfo() {
		const component = await this.navigationService.openAsOverlay(EditInfoComponent)
		component.editPerson(this.personId)
	}

	async editFiles() {
		const component = await this.navigationService.openAsOverlay(AddFileComponent)
		component.personId = this.personId
	}

	async editFile(file: PersonFile) {
		const component = await this.navigationService.openAsOverlay(EditFileComponent)
		component.personId = this.personId
		component.file = file
	}

	pathFor(file: PersonFile) {
		return `api/ancestry/file/${file.fileId}/${file.name}`
	}

	isImage(file: PersonFile) {
		const imageExtensions = [".jpg", ".png", ".bmp"]
		const fileName = file.name.toLowerCase()
		return imageExtensions.some(x => fileName.endsWith(x))
	}

	titleOf(info: { title: string, content: string }) {
		return this.predefinedInfoTexts[info.title] ?? info.title
	}
}
