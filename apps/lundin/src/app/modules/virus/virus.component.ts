import { Component } from "@angular/core"

@Component({
	selector: "lundin-virus",
	templateUrl: "./virus.component.html",
	styleUrls: ["./virus.component.scss"],
})
export class VirusComponent {
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "green", playerId: 2 },
	]
	boardSize = 8
	fieldSize = 20
	autoSize = true

	addPlayer() {
		this.players.push({ name: "Spiller 3", color: "blue", playerId: 3 })
	}

	restart() {
		/*const config = new VirusConfig(this.players.length)
		this.game = new Virus(config)
		this.message = ""*/
	}
}
