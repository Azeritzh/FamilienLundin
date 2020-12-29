import { Component } from "@angular/core"
import { TopScoreSet } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { MinestrygerService } from "../minestryger.service"

@Component({
	selector: "lundin-minestryger-highscores",
	templateUrl: "./minestryger-highscores.component.html",
	styleUrls: ["./minestryger-highscores.component.scss"],
})
export class MinestrygerHighscoresComponent {
	topScores$: Observable<TopScoreSet>

	constructor(minestrygerService: MinestrygerService) {
		this.topScores$ = minestrygerService.loadTopScores()
	}
}
