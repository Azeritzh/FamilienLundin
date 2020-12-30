import { Component, Input } from "@angular/core"
import { MinestrygerScoreSet, MinestrygerTopScoreSet } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { MinestrygerService } from "../minestryger.service"

@Component({
	selector: "lundin-minestryger-highscores",
	templateUrl: "./minestryger-highscores.component.html",
	styleUrls: ["./minestryger-highscores.component.scss"],
})
export class MinestrygerHighscoresComponent {
	@Input() category: string
	topScores$: Observable<MinestrygerTopScoreSet>
	myScores$: Observable<MinestrygerScoreSet>

	constructor(minestrygerService: MinestrygerService) {
		this.topScores$ = minestrygerService.loadTopScores()
		this.myScores$ = minestrygerService.loadMyScores()
	}

	currentCategory(myScores: MinestrygerScoreSet) {
		return myScores.categories[this.category] ?? []
	}
}
