import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Person, PersonalRelation } from "@lundin/api-interfaces"
import { BehaviorSubject, firstValueFrom } from "rxjs"
import { map } from "rxjs/operators"

@Injectable({
	providedIn: "root",
})
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
		firstValueFrom(this.httpClient.get<Person[]>("api/ancestry/load-all")).then(people => {
			this.people = people.sortBy(x => x.name)
			this.updatePeople$()
		})
		return this.people$
	}

	async add(person: Person) {
		const updatedPeople = await firstValueFrom(this.httpClient.post<Person[]>("api/ancestry/add", person))
		for (const person of updatedPeople)
			this.updatePerson(person)
		this.updatePeople$()
		return updatedPeople[0]
	}

	async updateInfo(personId: number, name: string, gender: "male" | "female" | "other", information: { title: string, content: string }[]) {
		const updatedPerson = await firstValueFrom(this.httpClient.post<Person>("api/ancestry/update-info", { personId, name, gender, information }))
		this.updatePerson(updatedPerson)
		this.updatePeople$()
		return updatedPerson
	}

	async updateRelations(personId: number, relations: PersonalRelation[]) {
		const updatedPeople = await firstValueFrom(this.httpClient.post<Person[]>("api/ancestry/update-relations", { personId, relations }))
		for (const person of updatedPeople)
			this.updatePerson(person)
		this.updatePeople$()
		return updatedPeople[0]
	}

	async delete(personId: number) {
		const updatedPeople = await firstValueFrom(this.httpClient.post<Person[]>("api/ancestry/delete", { personId }))
		for (const person of updatedPeople)
			this.updatePerson(person)
		this.people.removeBy(x => x._id === personId)
		this.updatePeople$()
	}

	async addFile(personId: number, file: { description: string, data: File }) {
		const formdata = new FormData()
		formdata.set("file", file.data)
		formdata.set("name", file.data.name)
		formdata.set("description", file.description)
		formdata.set("personId", "" + personId)
		const updatedPerson = await firstValueFrom(this.httpClient.post<Person>("api/ancestry/upload-file", formdata))
		this.updatePerson(updatedPerson)
		return updatedPerson
	}

	private updatePerson(person: Person) {
		const index = this.people.findIndex(x => x._id === person._id)
		if (index === -1)
			this.people.push(person)
		else
			this.people[index] = person
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