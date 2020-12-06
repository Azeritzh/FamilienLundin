import { Injectable } from "@nestjs/common"
import { expirationFrom, hashPassword, hashRefreshToken } from "../auth/hashing"
import { StorageService } from "../storage/storage.service"

export interface StoredUser {
	_id?: number
	username: string
	passwordHash: string
	refreshHash?: string
	refreshTokens?: { [expiration: string]: string }
}

@Injectable()
export class UserService {
	constructor(private readonly storageService: StorageService) { }

	async findOne(query: { _id: number } | { username: string }): Promise<StoredUser | undefined> {
		const users = this.storageService.userCollection
		return <StoredUser>users.findOne(query)
	}

	async addUser(username: string, password: string) {
		const passwordHash = await hashPassword(password)
		const users = this.storageService.userCollection
		return users.insertOne({ username, passwordHash })
	}

	async updatePassword(userId: number, password: string) {
		const passwordHash = await hashPassword(password)
		const users = this.storageService.userCollection
		return users.updateOne({ _id: userId }, { passwordHash })
	}

	async updateRefreshTokenHash(userId: number, token: string) {
		const hash = await hashRefreshToken(token)
		const users = this.storageService.userCollection
		users.updateOne({ _id: userId }, this.addToken(expirationFrom(token), hash))
	}

	async clearRefreshToken(userId: number, token: string) {
		const users = this.storageService.userCollection
		users.updateOne({ _id: userId }, this.removeToken(expirationFrom(token)))
	}

	private addToken = (expiration: number, token: string) => (user: StoredUser) => {
		if (!user.refreshTokens)
			user.refreshTokens = {}
		this.removeOutdatedTokens(user)
		user.refreshTokens[expiration] = token
	}

	private removeOutdatedTokens(user: StoredUser) {
		const expirations = Object.keys(user.refreshTokens)
		const now = new Date().getTime() / 1000
		for (const expiration of expirations)
			if (+expiration < now)
				delete user.refreshTokens[expiration]
	}

	private removeToken = (expiration: number) => (user: StoredUser) => {
		if (!user.refreshTokens)
			return
		delete user.refreshTokens[expiration]
	}
}
