import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { NewScore, TopScoreSet } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class MinestrygerService {
	topScores: TopScoreSet = {
		beginnerFlags: [],
		trainedFlags: [],
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

	async registerScore(score: NewScore) {
		this.topScores = await this.httpClient.post<TopScoreSet>("api/minestryger/register", score).toPromise()
		this._topScores$.next(this.topScores)
	}
}
