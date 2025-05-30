import { CommonModule } from "@angular/common"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Subscription } from "rxjs"
import { AncestryService } from "../ancestry.service"
import { AncestryTreeNodeComponent } from "./ancestry-tree-node.component"

@Component({
	selector: "lundin-ancestry-tree",
	templateUrl: "./ancestry-tree.component.html",
	styleUrls: ["./ancestry-tree.component.scss"],
	imports: [
		CommonModule,
		AncestryTreeNodeComponent,
	],
})
export class AncestryTreeComponent implements OnInit, OnDestroy {
	generations: Person[][] = []
	children: Person[] = []
	private subscription: Subscription | null = null

	constructor(
		private activatedRoute: ActivatedRoute,
		private ancestryService: AncestryService,
		private router: Router,
	) {
		ancestryService.load()
	}

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const id = +(params.get("id") ?? 0)
			this.updateSubscription(id)
		})
	}

	private updateSubscription(id: number) {
		this.subscription?.unsubscribe()
		this.subscription = this.ancestryService.person$(id).subscribe(this.setup)
	}

	private setup = (person: Person | undefined) => {
		if (!person)
			return
		this.generations = []
		this.generations.push([person])
		this.loadChildren(person)
		for (let depth = 1; this.generations.length === depth && depth < 8; depth++)
			this.loadGeneration(depth)
	}

	loadChildren(person: Person) {
		this.children = person.relations
			.filter(x => x.type === "child")
			.map(x => this.ancestryService.person(x.id))
			.filter(x => x !== undefined) as Person[]
	}

	private loadGeneration(depth: number) {
		const previousGeneration = this.generations[depth - 1]
		const generation: Person[] = []
		generation.length = Math.pow(2, depth)
		for (const i in previousGeneration)
			this.addParentsToNextGeneration(+i, previousGeneration[i], generation)
		if (!this.isEmpty(generation))
			this.generations.push(generation)
	}

	private addParentsToNextGeneration(index: number, person: Person, generation: Person[]) {
		const father = this.parentOf(person, "male")
		if (father)
			generation[index * 2] = father
		const mother = this.parentOf(person, "female")
		if (mother)
			generation[index * 2 + 1] = mother
	}

	private parentOf(person: Person, gender: "male" | "female") {
		return person.relations
			.filter(x => x.type === "parent")
			.map(x => this.ancestryService.person(x.id))
			.find(x => x?.gender === gender)
	}

	private isEmpty(list: any[]) {
		for (const i in list)
			return false
		return true
	}

	get currentPerson(): Person | undefined {
		return this.generations[0]?.[0]
	}

	navigateToDetails() {
		this.router.navigateByUrl("/ancestry/person/" + this.currentPerson?._id)
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}
