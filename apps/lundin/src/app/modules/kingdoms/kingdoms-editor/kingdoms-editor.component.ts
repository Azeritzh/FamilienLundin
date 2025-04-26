import { Component, Input } from "@angular/core"
import { Fertility, Kingdoms, Terrain } from "@lundin/kingdoms"
import { DisplayState } from "../kingdoms-display/display-state"

@Component({
	selector: "lundin-kingdoms-editor",
	templateUrl: "./kingdoms-editor.component.html",
	styleUrls: ["./kingdoms-editor.component.scss"],
})
export class KingdomsEditorComponent {
	@Input() game = new Kingdoms()
	@Input() displayState = new DisplayState()
	terrainBrush: Terrain | null = null
	fertilityBrush: Fertility | null = null

	clickField() {
		const { x, y } = this.displayState.selectedField ?? { x: 0, y: 0 }
		if (!this.game.state.board.isWithinBounds(x, y))
			return
		const field = this.game.state.board.get(x, y)
		if (this.terrainBrush !== null)
			field.terrain = this.terrainBrush
		if (this.fertilityBrush !== null)
			field.fertility = this.fertilityBrush
	}

	changeTerrain(terrain: Terrain | null) {
		this.terrainBrush = terrain
	}

	changeFertility(fertility: Fertility | null) {
		this.fertilityBrush = fertility
	}
}
