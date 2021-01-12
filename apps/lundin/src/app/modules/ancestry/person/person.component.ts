import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-person",
	templateUrl: "./person.component.html",
	styleUrls: ["./person.component.scss"],
})
export class PersonComponent implements OnInit {
	person$: Observable<Person>

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const id = +params.get("id")
			this.person$ = this.ancestryService.person$(id)
		})
	}
}
