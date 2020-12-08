import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { MessageThread } from "@lundin/api-interfaces"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-message-thread",
	templateUrl: "./message-thread.component.html",
	styleUrls: ["./message-thread.component.scss"],
})
export class MessageThreadComponent implements OnInit {
	thread = <MessageThread>{}

	constructor(
		private messageService: MessageService,
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const threadId = +params.get("id")
			this.thread = await this.messageService.getFullThread(threadId)
		})
	}

	addResponse() {
		console.log(this.thread)
	}
}
