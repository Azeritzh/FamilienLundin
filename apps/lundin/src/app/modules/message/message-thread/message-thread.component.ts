import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { MessageThread } from "@lundin/api-interfaces"
import { AuthService } from "../../../services/auth.service"
import { NavigationService } from "../../../services/navigation.service"
import { AddMessageComponent } from "../add-message/add-message.component"
import { EditMessageComponent } from "../edit-message/edit-message.component"
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
		private authService: AuthService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const threadId = +params.get("id")
			this.thread = await this.messageService.getFullThread(threadId)
		})
	}

	canEdit() {
		return this.thread.authorId === this.authService.loginInfo.userId
	}

	async addResponse() {
		const component = await this.navigationService.openAsOverlay(AddMessageComponent)
		component.threadId = this.thread._id
	}

	async editThread() {
		const component = await this.navigationService.openAsOverlay(EditMessageComponent)
		component.threadId = this.thread._id
		component.content = this.thread.content
		component.title = this.thread.title
	}
}
