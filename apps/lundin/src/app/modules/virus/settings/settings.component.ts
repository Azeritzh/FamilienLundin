import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
	selector: "lundin-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "green", playerId: 2 },
	]
	@Input() boardSize = 8
	@Output() boardSizeChange = new EventEmitter<number>()
	@Input() fieldSize = 50
	@Output() fieldSizeChange = new EventEmitter<number>()
	@Input() autoSize = true
	@Output() autoSizeChange = new EventEmitter<boolean>()
	@Output() triggerNewGame = new EventEmitter()
	showAdvancedSettings = false

	toggleAdvanced() {
		this.showAdvancedSettings = !this.showAdvancedSettings
	}

	addPlayer() {
		this.players.push({ name: "Spiller 3", color: "blue", playerId: 3 })
	}

	restart() {
		/*const config = new VirusConfig(this.players.length)
		this.game = new Virus(config)
		this.message = ""*/
	}
}
