import { Component, Input, OnDestroy } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { Subscription } from "rxjs"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-family-tree",
	templateUrl: "./family-tree.component.html",
	styleUrls: ["./family-tree.component.scss"],
})
export class FamilyTreeComponent implements OnDestroy {
	@Input() set personId(id: number) {
		this.updateSubscription(id)
	}
	person: Person
	parents: Person[]
	private subscription: Subscription

	constructor(
		private ancestryService: AncestryService,
	) { }

	private updateSubscription(id: number) {
		this.subscription?.unsubscribe()
		this.subscription = this.ancestryService.person$(id).subscribe(this.setup)
	}

	private setup = (person: Person) => {
		this.person = person
		this.parents = person.relations
			.filter(x => x.type === "parent")
			.map(x => this.ancestryService.person(x.id))
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}
