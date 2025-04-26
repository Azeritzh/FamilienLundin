import { Component, Input } from "@angular/core"
import { MinestrygerScoreSet, MinestrygerTopScoreSet } from "@lundin/api-interfaces"
import { Observable } from "rxjs"
import { MinestrygerService } from "../minestryger.service"

@Component({
	selector: "lundin-minestryger-highscores",
	templateUrl: "./minestryger-highscores.component.html",
	styleUrls: ["./minestryger-highscores.component.scss"],
	standalone: false,
})
export class MinestrygerHighscoresComponent {
	@Input() category: string = "beginnerFlags"
	topScoreCategories = [
		{ key: "beginnerFlags", title: "Begynder (med flag)" },
		{ key: "beginnerNoFlags", title: "Begynder (uden flag)" },
		{ key: "trainedFlags", title: "Øvet (med flag)" },
		{ key: "trainedNoFlags", title: "Øvet (uden flag)" },
		{ key: "expertFlags", title: "Ekspert (med flag)" },
		{ key: "expertNoFlags", title: "Ekspert (uden flag)" },
	]
	topScores$: Observable<MinestrygerTopScoreSet>
	yearlyTopScores$: Observable<MinestrygerTopScoreSet>
	myScores$: Observable<MinestrygerScoreSet>
	scoresThisYear = true

	constructor(minestrygerService: MinestrygerService) {
		this.topScores$ = minestrygerService.loadTopScores()
		this.yearlyTopScores$ = minestrygerService.loadYearlyTopScores()
		this.myScores$ = minestrygerService.loadMyScores()
	}

	currentTopScoreSet$() {
		return this.scoresThisYear
			? this.yearlyTopScores$
			: this.topScores$
	}

	currentCategory(myScores: MinestrygerScoreSet) {
		const scores = myScores.categories[this.category]
		if (!scores)
			return []
		const currentYear = "" + new Date().getFullYear()
		return this.scoresThisYear
			? scores.filter(x => x.date.startsWith(currentYear)).slice(0, 10)
			: scores.slice(0, 10)
	}

	switchPeriod() {
		this.scoresThisYear = !this.scoresThisYear
	}

	topscores(topscores: MinestrygerTopScoreSet, key: string) {
		const aber = <any>topscores
		return aber[key]
	}
}
