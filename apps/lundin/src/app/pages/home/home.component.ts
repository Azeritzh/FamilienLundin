import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { AddCalendarEventComponent } from "../../modules/calendar/add-calendar-event/add-calendar-event.component"
import { CalendarModule } from "../../modules/calendar/calendar.module"
import { AddMessageComponent } from "../../modules/message/add-message/add-message.component"
import { MessageModule } from "../../modules/message/message.module"
import { AuthService } from "../../services/auth.service"
import { NavigationService } from "../../services/navigation.service"
import { LoginComponent } from "../login/login.component"

@Component({
	selector: "lundin-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
	imports: [
		LoginComponent,
		MessageModule,
		CalendarModule,
		CommonModule,
	],
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
