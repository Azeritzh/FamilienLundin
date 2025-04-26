import { Component } from "@angular/core"
import { AddCalendarEventComponent } from "../../modules/calendar/add-calendar-event/add-calendar-event.component"
import { AddMessageComponent } from "../../modules/message/add-message/add-message.component"
import { AuthService } from "../../services/auth.service"
import { NavigationService } from "../../services/navigation.service"

@Component({
	selector: "lundin-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
	standalone: false,
})
export class HomeComponent {
	constructor(
		public authService: AuthService,
		private navigationService: NavigationService
	) { }

	async addThread() {
		this.navigationService.openAsOverlay(AddMessageComponent)
	}

	async addCalendarEvent() {
		this.navigationService.openAsOverlay(AddCalendarEventComponent)
	}
}
