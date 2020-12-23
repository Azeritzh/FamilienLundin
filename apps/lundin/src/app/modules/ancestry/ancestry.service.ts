import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Person } from "@lundin/api-interfaces"

@Injectable()
export class AncestryService {
	constructor(private httpClient: HttpClient) { }

	async load() {
		return await this.httpClient.get<Person[]>("api/ancestry/load-all").toPromise()
	}

	add(person: Person) {
		return this.httpClient.post<Person>("api/ancestry/add", person).toPromise()
	}
}