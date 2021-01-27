import { Component, Input } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-family-tree",
	templateUrl: "./family-tree.component.html",
	styleUrls: ["./family-tree.component.scss"],
})
export class FamilyTreeComponent {
	@Input() personId: number
	person$: Observable<Person>

	constructor(
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.person$ = this.ancestryService.person$(this.personId)
	}
}
