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
	partners: Person[]
	children: Person[]
	private subscription: Subscription

	constructor(
		private ancestryService: AncestryService,
	) { }

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
		this.partners = person.relations
			.filter(x => x.type === "partner")
			.map(x => this.ancestryService.person(x.id))
		this.children = person.relations
			.filter(x => x.type === "child")
			.map(x => this.ancestryService.person(x.id))
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	getFather() {
		return this.parents.find(x => x.gender === "male")
	}

	getMother() {
		return this.parents.find(x => x.gender === "female")
	}
}
