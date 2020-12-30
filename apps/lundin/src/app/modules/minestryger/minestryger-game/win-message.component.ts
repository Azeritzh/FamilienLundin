import { Component, Input } from "@angular/core"

@Component({
	selector: "lundin-win-message",
	templateUrl: "./win-message.component.html",
	styleUrls: ["./win-message.component.scss", "../../../styles/popup-box.scss"],
})
export class WinMessageComponent {
	@Input() time = 0
}
