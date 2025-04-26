import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { Person } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { NavigationService } from "../../../services/navigation.service"
import { AddPersonComponent } from "../add-person/add-person.component"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-ancestry-list",
	templateUrl: "./ancestry-list.component.html",
	styleUrls: ["./ancestry-list.component.scss"],
	standalone: false,
})
export class AncestryListComponent {
	people$: Observable<Person[]>
	query = ""
	includeAll = true

	constructor(
		ancestryService: AncestryService,
		private router: Router,
		private navigationService: NavigationService,
	) {
		this.people$ = ancestryService.load()
	}

	add() {
		this.navigationService.openAsOverlay(AddPersonComponent)
	}

	clickPerson(personId: number) {
		this.router.navigateByUrl("ancestry/person/" + personId)
	}

	bornFor(person: Person) {
		return person.information.find(x => x.title === "__born")?.content
	}

	deadFor(person: Person) {
		return person.information.find(x => x.title === "__dead")?.content
	}

	filter(people: Person[] | null) {
		return (people ?? [])
			.filter(x => this.includeAll || x.userId)
			.filter(x => this.search([x.name.toLowerCase()]))
	}

	private search(attributes: string[]): boolean {
		const searchedWords = this.query.toLowerCase().split(/\s/g)
		const existingWords = attributes.join(" ").toLowerCase().split(/\s/g)
		for (const word of searchedWords)
			if (!this.wordExists(word, existingWords))
				return false
		return true
	}

	private wordExists(word: string, words: string[]): boolean {
		return words.findIndex(x => x.startsWith(word)) > -1
	}
}
