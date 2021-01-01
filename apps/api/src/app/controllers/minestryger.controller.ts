import type { MinestrygerScoreSet, MinestrygerTopScore, MinestrygerTopScoreSet, NewMinestrygerScore } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"
import type { RequestWithUser } from "./auth.controller"

@Controller("minestryger")
export class MinestrygerController {
	constructor(
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("load-my-scores")
	async loadMyScores(@Req() request: RequestWithUser) {
		const userId = request.user._id
		return this.storageService.minestrygerScoreCollection.findOne({ userId }) ?? this.newMyScores(userId)
	}

	@UseGuards(JwtAuthGuard)
	@Get("load-top-scores")
	async loadTopScores() {
		return this.storageService.minestrygerTopScoreCollection.findOne({ year: undefined }) ?? this.newTopScores()
	}

	@UseGuards(JwtAuthGuard)
	@Get("load-yearly-top-scores")
	async loadYearlyTopScores() {
		return this.storageService.minestrygerTopScoreCollection.findOne({ year: new Date().getFullYear() + "" }) ?? this.newTopScores()
	}

	@UseGuards(JwtAuthGuard)
	@Post("register")
	async registerScore(@Req() request: RequestWithUser, @Body() score: NewMinestrygerScore) {
		this.addToTopScore(request.user._id, score)
		this.addToTopScore(request.user._id, score, score.date.substr(0, 4))
		this.addToPersonalScore(request.user._id, score)
		return [
			this.storageService.minestrygerTopScoreCollection.findOne({ year: undefined }),
			this.storageService.minestrygerTopScoreCollection.findOne({ year: new Date().getFullYear() + "" }),
		]
	}

	private addToPersonalScore(userId: number, score: NewMinestrygerScore) {
		this.ensureScoresExist(userId)
		const collection = this.storageService.minestrygerScoreCollection
		collection.updateOne({ userId }, this.updateScores(score))
	}

	private ensureScoresExist(userId: number) {
		const scores = this.storageService.minestrygerScoreCollection.findOne({ userId })
		if (!scores)
			this.storageService.minestrygerScoreCollection.insertOne(this.newMyScores(userId))
	}

	private updateScores = (score: NewMinestrygerScore) => (scoreSet: MinestrygerScoreSet) => {
		const scores = scoreSet.categories[score.type] ?? []
		scores.push({ time: score.time, date: score.date })
		scores.sort((a, b) => a.time - b.time)
		scoreSet.categories[score.type] = scores
	}

	private addToTopScore(userId: number, score: NewMinestrygerScore, year: string = undefined) {
		this.ensureTopScoresExist(year)
		const collection = this.storageService.minestrygerTopScoreCollection
		collection.updateOne({ year }, this.updateTopScores(userId, score))
	}

	private ensureTopScoresExist(year: string = undefined) {
		const topscores = this.storageService.minestrygerTopScoreCollection.findOne({ year })
		if (!topscores)
			this.storageService.minestrygerTopScoreCollection.insertOne(<any>this.newTopScores(year))
	}

	private updateTopScores = (userId: number, score: NewMinestrygerScore) => (topscores: MinestrygerTopScoreSet) => {
		const newScore = { userId, time: score.time, date: score.date }
		if (score.type === "9-9-10-f")
			this.insertInto(topscores.beginnerFlags, newScore)
		else if (score.type === "9-9-10-n")
			this.insertInto(topscores.beginnerNoFlags, newScore)
		else if (score.type === "16-16-40-f")
			this.insertInto(topscores.trainedFlags, newScore)
		else if (score.type === "16-16-40-n")
			this.insertInto(topscores.trainedNoFlags, newScore)
		else if (score.type === "30-16-99-f")
			this.insertInto(topscores.expertFlags, newScore)
		else if (score.type === "30-16-99-n")
			this.insertInto(topscores.expertNoFlags, newScore)
	}

	private insertInto(topscores: MinestrygerTopScore[], newScore: MinestrygerTopScore) {
		const existingScore = this.takeExisting(newScore.userId, topscores)
		const bestScore = existingScore?.time <= newScore.time
			? existingScore
			: newScore
		topscores.push(bestScore)
		topscores.sort((a, b) => a.time - b.time)
	}

	private takeExisting(userId: number, topscores: MinestrygerTopScore[]) {
		const existingScore = topscores.find(x => x.userId === userId)
		if (!existingScore)
			return
		const index = topscores.indexOf(existingScore)
		topscores.splice(index, 1)
		return existingScore
	}

	private newTopScores(year: string = undefined) {
		return { year, beginnerFlags: [], trainedFlags: [], expertFlags: [], beginnerNoFlags: [], trainedNoFlags: [], expertNoFlags: [] }
	}

	private newMyScores(userId: number) {
		return { _id: 0, userId, categories: {} }
	}
}
