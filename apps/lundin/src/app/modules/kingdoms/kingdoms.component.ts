import { Component, OnInit } from "@angular/core"
import { Kingdoms } from "@lundin/kingdoms"
import { DisplayState } from "./kingdoms-display/display-state"
import { FieldSelection } from "./kingdoms-display/kingdoms-display.component"

@Component({
	selector: "lundin-kingdoms",
	templateUrl: "./kingdoms.component.html",
	styleUrls: ["./kingdoms.component.scss"],
})
export class KingdomsComponent implements OnInit {
	game = new Kingdoms()
	displayState = new DisplayState()

	ngOnInit() {
		// TODO: this.game.setup()
	}

	clickField(selection: FieldSelection) {
		this.displayState.selectedField = { x: selection.x, y: selection.y }
	}
}
