import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { NewMinestrygerScore, MinestrygerTopScoreSet, MinestrygerScoreSet } from "@lundin/api-interfaces"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class MinestrygerService {
	topScores: MinestrygerTopScoreSet = {
		beginnerFlags: [],
		trainedFlags: [],
		expertFlags: [],
		beginnerNoFlags: [],
		trainedNoFlags: [],
		expertNoFlags: [],
	}
	private _topScores$ = new BehaviorSubject<MinestrygerTopScoreSet>(this.topScores)
	get topScores$() {
		return this._topScores$.asObservable()
	}

	myScores: MinestrygerScoreSet = {
		_id: 0,
		userId: 0,
		categories: {},
	}
	private _myScores$ = new BehaviorSubject<MinestrygerScoreSet>(this.myScores)
	get myScores$() {
		return this._myScores$.asObservable()
	}

	constructor(private httpClient: HttpClient) { }

	loadMyScores() {
		this.httpClient.get<MinestrygerScoreSet>("api/minestryger/load-my-scores").toPromise().then(myScores => {
			this.myScores = myScores
			this._myScores$.next(this.myScores)
		})
		return this.myScores$
	}

	loadTopScores() {
		this.httpClient.get<MinestrygerTopScoreSet>("api/minestryger/load-top-scores").toPromise().then(topScores => {
			this.topScores = topScores
			this._topScores$.next(this.topScores)
		})
		return this.topScores$
	}

	async registerScore(score: NewMinestrygerScore) {
		this.topScores = await this.httpClient.post<MinestrygerTopScoreSet>("api/minestryger/register", score).toPromise()
		this._topScores$.next(this.topScores)
	}
}
