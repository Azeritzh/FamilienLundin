import { Component, Input } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-ancestry-tree",
	templateUrl: "./ancestry-tree.component.html",
	styleUrls: ["./ancestry-tree.component.scss"],
})
export class AncestryTreeComponent {
	personId: number
	person$: Observable<Person>

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.personId = +params.get("id")
			this.person$ = this.ancestryService.person$(this.personId)
		})
	}
}
