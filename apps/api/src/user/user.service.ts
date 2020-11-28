import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"

export interface User {
	_id?: number
	username: string
	passwordHash: string
}

@Injectable()
export class UserService {
	private readonly users: User[] = [
		{
			_id: 1,
			username: "Kristjan",
			passwordHash: "$2b$10$EYHJXsD1xBB98ahx.ZU5IeCD/uZz/5TdzwV2IrIM56io5AdrgUKLW"
		},
		{
			_id: 2,
			username: "Test",
			passwordHash: "$2b$10$XJ1vSn9kXX6iRiDgXKfQG.QE1rwk.reUdZ4GD2KKJTRmh/P55LFcC"		
		},
	]

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username)
	}

	async addUser(username: string, password: string) {
		const passwordHash = await bcrypt.hash(password, 10)
		const user: User = { username, passwordHash }
		this.users.push(user)
		return user
	}
}
