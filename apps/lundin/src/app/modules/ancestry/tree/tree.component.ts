import { Component, Input } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-tree",
	templateUrl: "./tree.component.html",
	styleUrls: ["./tree.component.scss"],
})
export class TreeComponent {
	@Input() personId: number
	person$: Observable<Person>

	constructor(
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.person$ = this.ancestryService.person$(this.personId)
	}
}
