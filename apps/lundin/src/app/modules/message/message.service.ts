import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Message, MessageThread } from "@lundin/api-interfaces"

@Injectable()
export class MessageService {
	constructor(private httpClient: HttpClient) { }

	getThreads() {
		return this.httpClient.get<MessageThread[]>("api/message/getThreads").toPromise()
	}

	addThread(thread: MessageThread){
		return this.httpClient.post<MessageThread>("api/message/addThread", thread).toPromise()
	}

	getFullThread(threadId: number) {
		return this.httpClient.post<MessageThread>("api/message/getFullThread", { threadId }).toPromise()
	}

	addResponse(threadId: number, message: Message) {
		return this.httpClient.post("api/message/addResponse", { threadId, message }).toPromise()
	}
}
