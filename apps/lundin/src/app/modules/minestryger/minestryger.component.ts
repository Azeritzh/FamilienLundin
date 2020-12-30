import { Component } from "@angular/core"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent {
	width = 30
	height = 16
	bombs = 99
	allowFlags = true
	activateOnMouseDown = false

	currentCategory() {
		return `${this.width}-${this.height}-${this.bombs}-${this.allowFlags ? "f" : "n"}`
	}
}
