import { Component, EventEmitter, Input, Output } from "@angular/core"
import { VirusPlayer } from "../virus-game/virus-game.component"

@Component({
	selector: "lundin-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
	@Input() players = []
	@Output() playersChange = new EventEmitter<VirusPlayer[]>()
	@Input() boardSize = 8
	@Output() boardSizeChange = new EventEmitter<number>()
	@Input() fieldSize = 50
	@Output() fieldSizeChange = new EventEmitter<number>()
	@Input() autoSize = true
	@Output() autoSizeChange = new EventEmitter<boolean>()
	@Output() triggerNewGame = new EventEmitter<boolean>()
	showAdvancedSettings = false

	toggleAdvanced() {
		this.showAdvancedSettings = !this.showAdvancedSettings
	}

	addPlayer() {
		const newPlayerNumber = this.players.length + 1
		this.players.push(new VirusPlayer("Spiller " + newPlayerNumber, "blue"))
	}
}
