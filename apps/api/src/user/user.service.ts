import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { StorageService } from "../storage/storage.service"

export interface User {
	_id?: number
	username: string
	passwordHash: string
}

@Injectable()
export class UserService {
	constructor(private readonly storageService: StorageService) { }

	async findOne(username: string): Promise<User | undefined> {
		const users = this.storageService.getCollection("users")
		return <User>users.findOne({ username })
	}

	async addUser(username: string, password: string) {
		const passwordHash = await bcrypt.hash(password, 10)
		const users = this.storageService.getCollection("users")
		return <User>users.insertOne({ username, passwordHash })
	}
}
