import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Message, MessageThread } from "@lundin/api-interfaces"

@Injectable()
export class RecipesService {
	constructor(private httpClient: HttpClient) { }

	getThreads() {
		return this.httpClient.get<MessageThread[]>("api/message/get-threads").toPromise()
	}

	addThread(thread: MessageThread){
		return this.httpClient.post<MessageThread>("api/message/add-thread", thread).toPromise()
	}

	getFullThread(threadId: number) {
		return this.httpClient.post<MessageThread>("api/message/get-full-thread", { threadId }).toPromise()
	}

	addResponse(threadId: number, message: Message) {
		return this.httpClient.post("api/message/add-response", { threadId, message }).toPromise()
	}

	updateThread(threadId: number, title: string, content: string) {
		return this.httpClient.post("api/message/update-thread", { threadId, title, content }).toPromise()
	}
}
