import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Subscription } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-ancestry-tree",
	templateUrl: "./ancestry-tree.component.html",
	styleUrls: ["./ancestry-tree.component.scss"],
})
export class AncestryTreeComponent implements OnInit, OnDestroy {
	person: Person
	parents: Person[]
	private subscription: Subscription

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
	) {
		ancestryService.load()
	}

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const id = +params.get("id")
			this.updateSubscription(id)
		})
	}

	private updateSubscription(id: number) {
		this.subscription?.unsubscribe()
		this.subscription = this.ancestryService.person$(id).subscribe(this.setup)
	}

	private setup = (person: Person) => {
		if (!person)
			return
		this.person = person
		this.parents = person.relations
			.filter(x => x.type === "parent")
			.map(x => this.ancestryService.person(x.id))
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}
