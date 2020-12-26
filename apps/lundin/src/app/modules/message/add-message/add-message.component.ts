import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-add-message",
	templateUrl: "./add-message.component.html",
	styleUrls: ["./add-message.component.scss", "../../../styles/popup-box.scss"],
})
export class AddMessageComponent {
	threadId?: number
	title = ""
	content = ""

	constructor(
		private messageService: MessageService,
		private navigationService: NavigationService,
	) { }

	async addMessage() {
		if (!this.threadId)
			this.addMessageThread()
		else
			this.addMessageResponse()
		this.navigationService.closeOverlay()
	}

	async addMessageResponse() {
		const message = {
			authorId: 0,
			content: this.content,
			creationTime: new Date().toISOString(),
		}
		await this.messageService.addResponse(this.threadId, message)
		this.navigationService.open("messages/" + this.threadId)
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
		const { _id } = await this.messageService.addThread(thread)
		this.navigationService.open("messages/" + _id)
	}
}
