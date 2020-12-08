import { Component } from "@angular/core"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-add-message",
	templateUrl: "./add-message.component.html",
	styleUrls: ["./add-message.component.scss"],
})
export class AddMessageComponent {
	threadId?: number
	title = ""
	content = ""

	constructor(private messageService: MessageService) { }

	async addMessage() {
		if (!this.threadId)
			this.addMessageThread()
		else
			this.addMessageResponse()
	}

	async addMessageResponse() {
		const message = {
			authorId: 0,
			content: this.content,
			creationTime: new Date().toISOString(),
		}
		await this.messageService.addResponse(this.threadId, message)
		console.log("saved")
	}

	async addMessageThread() {
		const thread = {
			_id: 0,
			authorId: 0,
			title: this.title,
			content: this.content,
			creationTime: new Date().toISOString(),
			participantIds: [],
			responses: [],
		}
		await this.messageService.addThread(thread)
		console.log("saved")
	}
}
