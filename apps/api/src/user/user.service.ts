import { Injectable } from "@nestjs/common"

export interface User {
	_id: number
	username: string
	password: string
}

@Injectable()
export class UserService {
	private readonly users: User[] = [
		{
			_id: 1,
			username: "john",
			password: "changeme",
		},
		{
			_id: 2,
			username: "maria",
			password: "guess",
		},
	]

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username)
	}
}
