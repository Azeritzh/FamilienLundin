import { Component, OnInit } from "@angular/core"
import { Fertility, Kingdoms, Terrain } from "@lundin/kingdoms"
import { DisplayState } from "./kingdoms-display/display-state"
import { FieldSelection, KingdomsDisplayComponent } from "./kingdoms-display/kingdoms-display.component"
import { KingdomsEditorComponent } from "./kingdoms-editor/kingdoms-editor.component"

@Component({
	selector: "lundin-kingdoms",
	templateUrl: "./kingdoms.component.html",
	styleUrls: ["./kingdoms.component.scss"],
	imports: [
		KingdomsDisplayComponent,
		KingdomsEditorComponent,
	],
})
export class KingdomsComponent implements OnInit {
	game = new Kingdoms()
	displayState = new DisplayState()
	terrain!: string
	fertility!: string
	blabla!: string

	ngOnInit() {
		// TODO: this.game.setup()
	}

	clickField(selection: FieldSelection) {
		const { x, y } = selection
		this.displayState.selectedField = { x, y }
		if (!this.game.state.board.isWithinBounds(x, y))
			return
		const field = this.game.state.board.get(x, y)
		this.terrain = Terrain[field.terrain]
		this.fertility = Fertility[field.fertility]
		this.blabla = field.controller
			? this.game.state.players.find(x => x.id === field.controller)?.name ?? ""
			: ""
	}
}
