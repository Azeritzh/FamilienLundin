import { Component } from "@angular/core"
import { MessageThread } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-message-list",
	templateUrl: "./message-list.component.html",
	styleUrls: ["./message-list.component.scss"],
})
export class MessageListComponent {
	threads: MessageThread[] = []

	constructor(
		private messageService: MessageService,
		private navigationService: NavigationService,
	) {
		this.updateThreads()
	}

	async updateThreads() {
		this.threads = await this.messageService.getThreads()
	}

	openThread(threadId: number){
		this.navigationService.open("messages/" + threadId)
	}
}
