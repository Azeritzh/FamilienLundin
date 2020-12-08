import { MessageThread } from "@lundin/api-interfaces"
import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import { StoredUser } from "../user/user.service"
import { Collection } from "./collection"

@Injectable()
export class StorageService {
	cryptCollection = new Collection<{ _id?: number, userId: number, encrypted: string }>("crypt", this)
	messageCollection = new Collection<MessageThread>("messages", this)
	userCollection = new Collection<StoredUser>("users", this)

	saveJsonFile(name: string, content: any): Promise<void> {
		const path = "./storage/" + name + ".json"
		return new Promise((resolve, reject) => {
			fs.writeFile(
				path,
				JSON.stringify(content, null, "\t"),
				{ encoding: "utf-8" },
				error => {
					if (error)
						reject(error)
					else
						resolve()
				})
		})
	}

	loadJsonFile(name: string): Promise<any> {
		const path = "./storage/" + name + ".json"
		return new Promise((resolve, reject) => {
			if (!fs.existsSync(path))
				return resolve({})
			fs.readFile(
				path,
				"utf-8",
				(error, data) => {
					if (error)
						reject(error)
					else
						resolve(JSON.parse(data))
				})
		})
	}
}
