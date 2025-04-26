import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
	selector: "lundin-calendar-root",
	template: "<router-outlet></router-outlet>",
	styleUrls: ["./calendar-root.component.scss"],
	imports: [
		RouterModule,
	],
})
export class CalendarRootComponent { }
