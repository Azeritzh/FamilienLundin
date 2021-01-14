import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Person } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"

@Injectable()
export class AncestryService {
	people: Person[] = []
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

	person$(id: number) {
		const toThisPerson = (people: Person[]) => people.find(x => x._id === id)
		return this._people$.asObservable().pipe(map(toThisPerson))
	}

	person(id: number) {
		return this.people.find(x => x._id === id)
	}
}