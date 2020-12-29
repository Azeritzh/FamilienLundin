import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { TopScoreSet } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class MinestrygerService {
	topScores: TopScoreSet = {
		beginnerFlags: [{ userId: 678138, time: 12023, date: "2020-03-23" }],
		trainedFlags: [{ userId: 678138, time: 52723, date: "2020-03-24" }],
		expertFlags: [],
		beginnerNoFlags: [],
		trainedNoFlags: [],
		expertNoFlags: [],
	}
	private _topScores$ = new BehaviorSubject<TopScoreSet>(this.topScores)
	get topScores$() {
		return this._topScores$.asObservable()
	}

	constructor(private httpClient: HttpClient) { }

	loadTopScores() {
		this.httpClient.get<TopScoreSet>("api/minestryger/load-top-scores").toPromise().then(topScores => {
			this.topScores = topScores
			this._topScores$.next(this.topScores)
		})
		return this.topScores$
	}

	registerScore(score: { time: number, date: string }) {
		return this.httpClient.post("api/minestryger/register", score).toPromise()
	}
}
