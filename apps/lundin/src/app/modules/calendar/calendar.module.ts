import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { AddCalendarEventComponent } from "./add-calendar-event/add-calendar-event.component"
import { CalendarEventListComponent } from "./calendar-event-list/calendar-event-list.component"
import { CalendarRootComponent } from "./calendar-root/calendar-root.component"
import { CalendarService } from "./calendar.service"
import { CalendarComponent } from "./calendar/calendar.component"

@NgModule({
	declarations: [
		AddCalendarEventComponent,
		CalendarComponent,
		CalendarEventListComponent,
		CalendarRootComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		SharedModule,
	],
	providers: [CalendarService],
	exports: [
		AddCalendarEventComponent,
		CalendarEventListComponent,
		CalendarRootComponent,
	],
})
export class CalendarModule { }
