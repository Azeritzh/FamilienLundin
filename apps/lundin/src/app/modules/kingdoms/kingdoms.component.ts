import { Component, OnInit } from "@angular/core"
import { Kingdoms } from "@lundin/kingdoms"

@Component({
	selector: "lundin-kingdoms",
	templateUrl: "./kingdoms.component.html",
	styleUrls: ["./kingdoms.component.scss"],
})
export class KingdomsComponent implements OnInit {
	game = new Kingdoms()

	ngOnInit() {
		// TODO: this.game.setup()
	}
}
