import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { AddCalendarEventComponent } from "./add-calendar-event/add-calendar-event.component"
import { CalendarEventListComponent } from "./calendar-event-list/calendar-event-list.component"
import { CalendarService } from "./calendar.service"

@NgModule({
	declarations: [
		AddCalendarEventComponent,
		CalendarEventListComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		SharedModule,
	],
	providers: [CalendarService],
	exports: [
		AddCalendarEventComponent,
		CalendarEventListComponent,
	],
})
export class CalendarModule { }
