import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Person, PersonalRelation } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"

@Injectable()
export class AncestryService {
	people: Person[] = []
	private _people$ = new BehaviorSubject<Person[]>(this.people.slice())
	get people$() {
		return this._people$.asObservable()
	}

	constructor(private httpClient: HttpClient) {
		this.load()
	}

	load() {
		this.httpClient.get<Person[]>("api/ancestry/load-all").toPromise().then(people => {
			this.people = people
			this.updatePeople$()
		})
		return this.people$
	}

	async add(person: Person) {
		const updatedPeople = await this.httpClient.post<Person[]>("api/ancestry/add", person).toPromise()
		for (const person of updatedPeople)
			this.updatePerson(person)
		return updatedPeople[0]
	}

	async updateInfo(personId: number, name: string, gender: "male" | "female" | "other", information: { title: string, content: string }[]) {
		const updatedPerson = await this.httpClient.post<Person>("api/ancestry/update-info", { personId, name, gender, information }).toPromise()
		this.updatePerson(updatedPerson)
		return updatedPerson
	}

	async updateRelations(personId: number, relations: PersonalRelation[]) {
		const updatedPeople = await this.httpClient.post<Person[]>("api/ancestry/update-relations", { personId, relations }).toPromise()
		for (const person of updatedPeople)
			this.updatePerson(person)
		return updatedPeople[0]
	}

	async addFile(personId: number, file: { description: string, data: File }) {
		const formdata = new FormData()
		formdata.set("file", file.data)
		formdata.set("name", file.data.name)
		formdata.set("description", file.description)
		formdata.set("personId", "" + personId)
		const updatedPerson = await this.httpClient.post<Person>("api/ancestry/upload-file", formdata).toPromise()
		this.updatePerson(updatedPerson)
		return updatedPerson
	}

	private updatePerson(person: Person) {
		const index = this.people.findIndex(x => x._id === person._id)
		if (index === -1)
			this.people.push(person)
		else
			this.people[index] = person
		this.updatePeople$()
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