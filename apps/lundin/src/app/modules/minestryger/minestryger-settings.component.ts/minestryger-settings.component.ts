import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
	selector: "lundin-minestryger-settings",
	templateUrl: "./minestryger-settings.component.html",
	styleUrls: ["./minestryger-settings.component.scss"],
})
export class MinestrygerSettingsComponent {
	@Input() width = 30
	@Output() widthChange = new EventEmitter<number>()
	@Input() height = 16
	@Output() heightChange = new EventEmitter<number>()
	@Input() bombs = 99
	@Output() bombsChange = new EventEmitter<number>()
	@Input() allowFlags = true
	@Output() allowFlagsChange = new EventEmitter<number>()
	@Input() activateOnMouseDown = false
	@Output() activateOnMouseDownChange = new EventEmitter<number>()
}
