import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { StorageService } from "../storage/storage.service"

export interface User {
	_id?: number
	username: string
	passwordHash: string
	refreshHash?: string
}

@Injectable()
export class UserService {
	constructor(private readonly storageService: StorageService) { }

	async findOne(query: { _id: number } | { username: string }): Promise<User | undefined> {
		const users = this.storageService.getCollection("users")
		return <User>users.findOne(query)
	}

	async addUser(username: string, password: string) {
		const passwordHash = await bcrypt.hash(password, 10)
		const users = this.storageService.getCollection("users")
		return <User>users.insertOne({ username, passwordHash })
	}

	async updateRefreshTokenHash(userId: number, refreshToken: string) {
		const refreshHash = await bcrypt.hash(refreshToken, 10)
		const users = this.storageService.getCollection("users")
		users.updateOne({ _id: userId }, { refreshHash })
	}

	async clearRefreshTokenHash(userId: number) {
		const users = this.storageService.getCollection("users")
		users.updateOne({ _id: userId }, { refreshHash: null })
	}
}
