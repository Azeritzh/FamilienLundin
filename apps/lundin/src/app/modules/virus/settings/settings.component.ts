import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { RandomAi } from "@lundin/age"
import { generateVirusActions } from "@lundin/virus"
import { VirusPlayer } from "../virus-game/virus-game.component"

@Component({
	selector: "lundin-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
	imports: [
		CommonModule,
		FormsModule,
	],
})
export class SettingsComponent {
	@Input() players: VirusPlayer[] = []
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

	typeOf(player: VirusPlayer) {
		if (!player.ai)
			return "human"
		else
			return "random"
	}

	changePlayerType(player: VirusPlayer, type: string) {
		if (type === "human")
			return player.ai = null
		else if (type === "random")
			return player.ai = new RandomAi(generateVirusActions)
		else
			return this.removePlayer(player)
	}

	private removePlayer(player: VirusPlayer) {
		const index = this.players.indexOf(player)
		this.players.splice(index, 1)
		this.playersChange.emit(this.players)
	}
}
