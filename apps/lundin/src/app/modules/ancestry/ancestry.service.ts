import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class AncestryService {
	people = []
	private _people$ = new BehaviorSubject<Person[]>(this.people.slice())
	get people$() {
		return this._people$.asObservable()
	}

	constructor(private httpClient: HttpClient) { }

	load() {
		this.httpClient.get<Person[]>("api/ancestry/load-all").toPromise().then(people => {
			this.people = people
			this.updatePeople$()
		})
		return this.people$
	}

	async add(person: Person) {
		const savedPerson = await this.httpClient.post<Person>("api/ancestry/add", person).toPromise()
		this.people.push(savedPerson)
		this.updatePeople$()
		return savedPerson
	}

	private updatePeople$() {
		this._people$.next(this.people.slice())
	}
}