import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { CalendarEvent } from "@lundin/api-interfaces"

@Injectable()
export class CalendarService {
	constructor(private httpClient: HttpClient) { }

	getCalendarEvents() {
		return this.httpClient.get<CalendarEvent[]>("api/message/get-calendar-events").toPromise()
	}

	addCalendarEvent(event: CalendarEvent) {
		return this.httpClient.post<CalendarEvent>("api/message/add-calendar-event", event).toPromise()
	}
}
