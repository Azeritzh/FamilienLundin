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
	topScoreCategories = [
		{ key: "beginnerFlags", title: "Begynder (med flag)" },
		{ key: "trainedFlags", title: "Øvet (med flag)" },
		{ key: "expertFlags", title: "Ekspert (med flag)" },
		{ key: "beginnerNoFlags", title: "Begynder (ingen flag)" },
		{ key: "trainedNoFlags", title: "Øvet (ingen flag)" },
		{ key: "expertNoFlags", title: "Ekspert (ingen flag)" },
	]
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
