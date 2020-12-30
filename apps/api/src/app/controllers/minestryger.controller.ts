import type { NewMinestrygerScore, MinestrygerTopScoreSet, MinestrygerTopScore } from "@lundin/api-interfaces"
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
	@Get("load-top-scores")
	async loadTopScores() {
		return this.storageService.minestrygerTopScoreCollection.findOne() ?? this.newTopScores()
	}

	@UseGuards(JwtAuthGuard)
	@Post("register")
	async registerScore(@Req() request: RequestWithUser, @Body() score: NewMinestrygerScore) {
		this.ensureTopScoresExist()
		const collection = this.storageService.minestrygerTopScoreCollection
		collection.updateOne(() => true, this.updateTopScores(request.user._id, score))
		return collection.findOne()
	}

	private ensureTopScoresExist() {
		const topscores = this.storageService.minestrygerTopScoreCollection.findOne()
		if (!topscores)
			this.storageService.minestrygerTopScoreCollection.insertOne(<any>this.newTopScores())
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

	private newTopScores() {
		return { beginnerFlags: [], trainedFlags: [], expertFlags: [], beginnerNoFlags: [], trainedNoFlags: [], expertNoFlags: [] }
	}
}
