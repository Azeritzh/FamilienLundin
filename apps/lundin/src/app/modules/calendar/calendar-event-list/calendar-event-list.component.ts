import { Component } from "@angular/core"
import { CalendarEvent } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { CalendarService } from "../calendar.service"

@Component({
	selector: "lundin-calendar-event-list",
	templateUrl: "./calendar-event-list.component.html",
	styleUrls: ["./calendar-event-list.component.scss"],
})
export class CalendarEventListComponent {
	events: CalendarEvent[] = []

	constructor(
		private calendarService: CalendarService,
		private navigationService: NavigationService,
	) {
		this.updateEvents()
	}

	async updateEvents() {
		this.events = await this.calendarService.getCalendarEvents()
	}

	openEvent(eventId: number) {
		console.log("Clicked event " + eventId)
		// this.navigationService.open("messages/" + threadId)
	}
}
