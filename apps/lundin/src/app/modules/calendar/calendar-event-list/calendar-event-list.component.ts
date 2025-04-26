import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { CalendarEvent } from "@lundin/api-interfaces"
import { CalendarService } from "../calendar.service"

@Component({
	selector: "lundin-calendar-event-list",
	templateUrl: "./calendar-event-list.component.html",
	styleUrls: ["./calendar-event-list.component.scss"],
	standalone: false,
})
export class CalendarEventListComponent {
	events: CalendarEvent[] = []

	constructor(
		private calendarService: CalendarService,
		private router: Router,
	) {
		this.updateEvents()
	}

	async updateEvents() {
		this.events = await this.calendarService.getCalendarEvents()
	}

	openEvent(eventId: number) {
		console.log("Clicked event " + eventId)
		// this.router.navigateByUrl("messages/" + threadId)
	}
}
