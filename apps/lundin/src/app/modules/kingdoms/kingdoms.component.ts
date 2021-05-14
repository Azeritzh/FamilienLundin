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
	terrain: string
	fertility: string
	blabla: string

	ngOnInit() {
		// TODO: this.game.setup()
	}

	clickField(selection: FieldSelection) {
		this.displayState.selectedField = { x: selection.x, y: selection.y }
		if (!this.game.state.board.isWithinBounds(selection.x, selection.y))
			return
		const field = this.game.state.board.get(selection.x, selection.y)
		this.terrain = field.terrain.toString()
		this.fertility = field.fertility.toString()
		this.blabla = field.controller
			? this.game.state.players.find(x => x.id === field.controller).name
			: ""
	}
}
