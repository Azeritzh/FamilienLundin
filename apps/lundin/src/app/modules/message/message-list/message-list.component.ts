import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { MessageThread } from "@lundin/api-interfaces"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-message-list",
	templateUrl: "./message-list.component.html",
	styleUrls: ["./message-list.component.scss"],
	standalone: false,
})
export class MessageListComponent {
	threads: MessageThread[] = []

	constructor(
		private messageService: MessageService,
		private router: Router,
	) {
		this.updateThreads()
	}

	async updateThreads() {
		this.threads = await this.messageService.getThreads()
		this.threads = this.threads.sortBy(x => x.creationTime).reverse()
	}

	openThread(threadId: number) {
		this.router.navigateByUrl("messages/" + threadId)
	}

	firstLineOfThread(thread: MessageThread) {
		const lines = thread.content.split("\n")
		return lines.length > 1
			? lines[0] + " [...]"
			: lines[0]
	}
}
