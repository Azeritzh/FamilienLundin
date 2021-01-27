import { Component, Input, OnDestroy } from "@angular/core"
import { Person, PersonalRelation } from "@lundin/api-interfaces"
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
	siblings: Person[]
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
		this.siblings = this.getSiblingRelations()
			.map(x => this.ancestryService.person(x.id))
	}

	private getSiblingRelations(): PersonalRelation[] {
		const siblingSets = this.parents.map(x => x.relations.filter(this.isOtherChild))
		return [].concat(...siblingSets).filter(this.onlyUnique)
	}

	private isOtherChild = (relation: PersonalRelation) => {
		return relation.id !== this.person._id && relation.type === "child"
	}

	private onlyUnique(relation: PersonalRelation, index: number, self: PersonalRelation[]) {
		return self.findIndex(x => relation.id === x.id) === index
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
