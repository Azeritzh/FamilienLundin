import { Component, EventEmitter, Input, Output } from "@angular/core"
import { VirusPlayer } from "../virus-game/virus-game.component"

@Component({
	selector: "lundin-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
	@Input() players = [
		new VirusPlayer("Spiller 1", "red", 1),
		new VirusPlayer("Spiller 2", "green", 2),
	]
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
		this.players.push({ name: "Spiller 3", color: "blue", playerId: 3 })
	}
}
