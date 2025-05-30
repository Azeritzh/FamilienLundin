import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CalendarEvent } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { LabellingDirective } from "../../../shared/directives/labelling.directive"
import { CalendarService } from "../calendar.service"

@Component({
	selector: "lundin-add-calendar-event",
	templateUrl: "./add-calendar-event.component.html",
	styleUrls: ["./add-calendar-event.component.scss", "../../../styles/popup-box.scss"],
	imports: [
		FormsModule,
		LabellingDirective,
	],
})
export class AddCalendarEventComponent {
	event: CalendarEvent = {
		_id: 0,
		title: "",
		description: "",
		date: "2020-01-01",
		startTime: "08:00",
		endTime: "10:00",
		participantIds: [],
	}

	constructor(
		private calendarService: CalendarService,
		private navigationService: NavigationService,
	) { }

	async addCalendarEvent() {
		await this.calendarService.addCalendarEvent(this.event)
		this.navigationService.closeOverlay()
	}
}
