import { Component } from "@angular/core"
import { MessageThread } from "@lundin/api-interfaces"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-add-thread",
	templateUrl: "./add-thread.component.html",
	styleUrls: ["./add-thread.component.scss"],
})
export class AddThreadComponent {
	thread: MessageThread = {
		_id: 0,
		title: "",
		content: "",
		authorId: 0,
		creationTime: "",
		participantIds: [],
		responses: [],
	}

	constructor(private messageService: MessageService) {}

	async addThread() {
		this.thread.creationTime = new Date().toISOString()
		await this.messageService.addThread(this.thread)
		console.log("saved")
	}
}
