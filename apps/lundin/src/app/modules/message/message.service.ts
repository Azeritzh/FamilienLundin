import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"

@Injectable()
export class MessageService {
	constructor(private httpClient: HttpClient) { }

	async load() {
		return await this.httpClient.get<string>("api/message/load").toPromise()
	}

	save(message: string) {
		return this.httpClient.post("api/message/save", { message }).toPromise()
	}
}