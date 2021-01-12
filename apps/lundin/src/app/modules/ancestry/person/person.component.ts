import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-person",
	templateUrl: "./person.component.html",
	styleUrls: ["./person.component.scss"],
})
export class PersonComponent implements OnInit {
	person: Person = {
		_id: 0,
		name: "",
		information: [{ title: "Født", content: "" }, { title: "Død", content: "" }],
		relations: [],
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const id = +params.get("id")
			console.log(id)
			// this.person = await this.ancestryService.getPerson(id)
		})
	}
}
