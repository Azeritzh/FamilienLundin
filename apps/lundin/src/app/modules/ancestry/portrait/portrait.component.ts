import { Component, Input } from "@angular/core"
import { Person } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-portrait",
	templateUrl: "./portrait.component.html",
	styleUrls: ["./portrait.component.scss"],
})
export class PortraitComponent {
	@Input() person: Person
}
