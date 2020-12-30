import { Component } from "@angular/core"
import { MinestrygerScoreSet, MinestrygerTopScoreSet } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { MinestrygerService } from "../minestryger.service"

@Component({
	selector: "lundin-minestryger-highscores",
	templateUrl: "./minestryger-highscores.component.html",
	styleUrls: ["./minestryger-highscores.component.scss"],
})
export class MinestrygerHighscoresComponent {
	topScores$: Observable<MinestrygerTopScoreSet>
	myScores$: Observable<MinestrygerScoreSet>

	constructor(minestrygerService: MinestrygerService) {
		this.topScores$ = minestrygerService.loadTopScores()
		this.myScores$ = minestrygerService.loadMyScores()
	}

	currentCategory(myScores: MinestrygerScoreSet) {
		return myScores.categories["9-9-10-f"] ?? []
	}
}
