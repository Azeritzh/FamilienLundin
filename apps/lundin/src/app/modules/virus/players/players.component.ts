import { Component } from "@angular/core"

@Component({
	selector: "lundin-players",
	templateUrl: "./players.component.html",
	styleUrls: ["./players.component.scss"],
})
export class PlayersComponent {
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "green", playerId: 2 },
	]

	addPlayer() {
		this.players.push({ name: "Spiller 3", color: "blue", playerId: 3 })
	}

	restart() {
		/*const config = new VirusConfig(this.players.length)
		this.game = new Virus(config)
		this.message = ""*/
	}
}
