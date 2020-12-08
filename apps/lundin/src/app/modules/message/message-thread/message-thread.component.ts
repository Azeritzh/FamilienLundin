import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { MessageThread } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AddMessageComponent } from "../add-message/add-message.component"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-message-thread",
	templateUrl: "./message-thread.component.html",
	styleUrls: ["./message-thread.component.scss"],
})
export class MessageThreadComponent implements OnInit {
	thread = <MessageThread>{}

	constructor(
		private activatedRoute: ActivatedRoute,
		private messageService: MessageService,
		private navigationService: NavigationService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const threadId = +params.get("id")
			this.thread = await this.messageService.getFullThread(threadId)
		})
	}

	async addResponse() {
		const component = await this.navigationService.openAsOverlay(AddMessageComponent)
		component.threadId = this.thread._id
	}
}
