import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { NewMinestrygerScore, MinestrygerTopScoreSet, MinestrygerScoreSet } from "@lundin/api-interfaces"
import { BehaviorSubject, firstValueFrom } from "rxjs"

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
	yearlyTopScores: MinestrygerTopScoreSet = {
		beginnerFlags: [],
		trainedFlags: [],
		expertFlags: [],
		beginnerNoFlags: [],
		trainedNoFlags: [],
		expertNoFlags: [],
	}
	private _yearlyTopScores$ = new BehaviorSubject<MinestrygerTopScoreSet>(this.yearlyTopScores)
	get yearlyTopScores$() {
		return this._yearlyTopScores$.asObservable()
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
		firstValueFrom(this.httpClient.get<MinestrygerScoreSet>("api/minestryger/load-my-scores")).then(myScores => {
			this.myScores = myScores
			this._myScores$.next(this.myScores)
		})
		return this.myScores$
	}

	loadTopScores() {
		firstValueFrom(this.httpClient.get<MinestrygerTopScoreSet>("api/minestryger/load-top-scores")).then(topScores => {
			this.topScores = topScores
			this._topScores$.next(this.topScores)
		})
		return this.topScores$
	}

	loadYearlyTopScores() {
		firstValueFrom(this.httpClient.get<MinestrygerTopScoreSet>("api/minestryger/load-yearly-top-scores")).then(topScores => {
			this.yearlyTopScores = topScores
			this._yearlyTopScores$.next(this.yearlyTopScores)
		})
		return this.yearlyTopScores$
	}

	async registerScore(score: NewMinestrygerScore) {
		this.addToPersonalScore(score)
		this._myScores$.next(this.myScores)
		const topScores = await firstValueFrom(this.httpClient.post<[MinestrygerTopScoreSet,MinestrygerTopScoreSet]>("api/minestryger/register", score))
		this.topScores = topScores[0]
		this.yearlyTopScores = topScores[1]
		this._topScores$.next(this.topScores)
		this._yearlyTopScores$.next(this.yearlyTopScores)
	}

	private addToPersonalScore(score: NewMinestrygerScore) {
		const scores = this.myScores.categories[score.type] ?? []
		scores.push({ time: score.time, date: score.date })
		scores.sort((a, b) => a.time - b.time)
		this.myScores.categories[score.type] = scores
	}
}
