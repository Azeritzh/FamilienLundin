import { Component } from "@angular/core"

@Component({
	selector: "lundin-minestryger-highscores",
	templateUrl: "./minestryger-highscores.component.html",
	styleUrls: ["./minestryger-highscores.component.scss"],
})
export class MinestrygerHighscoresComponent {
	topHighscoresFlags: TopScoreSet = {
		beginner: [{ userId: 678138, time: 12023, date: "2020-03-23" }],
		trained: [{ userId: 678138, time: 52723, date: "2020-03-24" }],
		expert: [],
	}

	topHighscoresNoFlags: TopScoreSet = {
		beginner: [],
		trained: [],
		expert: [],
	}
}

interface TopScoreSet {
	beginner: HighScore[]
	trained: HighScore[]
	expert: HighScore[]
}

interface HighScore {
	userId: number
	time: number
	date: string
}
