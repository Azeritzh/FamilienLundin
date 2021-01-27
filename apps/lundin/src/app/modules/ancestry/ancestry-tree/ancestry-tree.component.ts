import { Component, Input } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-ancestry-tree",
	templateUrl: "./ancestry-tree.component.html",
	styleUrls: ["./ancestry-tree.component.scss"],
})
export class AncestryTreeComponent {
	@Input() personId: number
	person$: Observable<Person>

	constructor(
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.person$ = this.ancestryService.person$(this.personId)
	}
}
