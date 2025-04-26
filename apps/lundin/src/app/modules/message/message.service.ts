import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Message, MessageThread } from "@lundin/api-interfaces"
import { firstValueFrom } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class MessageService {
	constructor(private httpClient: HttpClient) { }

	getThreads() {
		return firstValueFrom(this.httpClient.get<MessageThread[]>("api/message/get-threads"))
	}

	addThread(thread: MessageThread){
		return firstValueFrom(this.httpClient.post<MessageThread>("api/message/add-thread", thread))
	}

	getFullThread(threadId: number) {
		return firstValueFrom(this.httpClient.post<MessageThread>("api/message/get-full-thread", { threadId }))
	}

	addResponse(threadId: number, message: Message) {
		return firstValueFrom(this.httpClient.post("api/message/add-response", { threadId, message }))
	}

	updateThread(threadId: number, title: string, content: string) {
		return firstValueFrom(this.httpClient.post("api/message/update-thread", { threadId, title, content }))
	}
}
