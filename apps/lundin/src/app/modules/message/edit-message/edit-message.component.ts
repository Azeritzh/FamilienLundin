import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { NavigationService } from "../../../services/navigation.service"
import { MessageService } from "../message.service"

@Component({
	selector: "lundin-edit-message",
	templateUrl: "./edit-message.component.html",
	styleUrls: ["./edit-message.component.scss", "../../../styles/popup-box.scss"],
	imports: [
		FormsModule,
	],
})
export class EditMessageComponent {
	threadId = 0
	title = ""
	content = ""

	constructor(
		private messageService: MessageService,
		private router: Router,
		private navigationService: NavigationService,
	) { }

	async updateMessage() {
		this.messageService.updateThread(this.threadId, this.title, this.content)
			.then(() => this.router.navigateByUrl("messages/" + this.threadId))
		this.navigationService.closeOverlay()
	}
}
