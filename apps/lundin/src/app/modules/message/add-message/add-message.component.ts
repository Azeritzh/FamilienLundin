import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { NavigationService } from "../../../services/navigation.service"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-add-message",
	templateUrl: "./add-message.component.html",
	styleUrls: ["./add-message.component.scss", "../../../styles/popup-box.scss"],
	standalone: false,
})
export class AddMessageComponent {
	threadId?: number
	title = ""
	content = ""

	constructor(
		private messageService: MessageService,
		private router: Router,
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
		await this.messageService.addResponse(this.threadId ?? 0, message) // TODO: ?? 0
		this.router.navigateByUrl("messages/" + this.threadId)
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
		this.router.navigateByUrl("messages/" + _id)
	}
}
