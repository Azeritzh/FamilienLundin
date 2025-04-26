import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { CalendarEvent } from "@lundin/api-interfaces"
import { firstValueFrom } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class CalendarService {
	constructor(private httpClient: HttpClient) { }

	getCalendarEvents() {
		return firstValueFrom(this.httpClient.get<CalendarEvent[]>("api/calendar/get-calendar-events"))
	}

	addCalendarEvent(event: CalendarEvent) {
		return firstValueFrom(this.httpClient.post<CalendarEvent>("api/calendar/add-calendar-event", event))
	}
}
