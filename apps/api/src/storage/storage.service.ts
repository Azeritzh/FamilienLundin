import { Injectable } from "@nestjs/common"
import { Collection } from "./collection"
import * as fs from "fs"

@Injectable()
export class StorageService {
	private collections: { [name: string]: Collection } = {}

	constructor() {
		fs.readdir(
			"./storage/",
			"utf-8",
			(error, files) => {
				if (error)
					console.log(error)
				for (const file of files)
					this.loadFile(file)
			})
	}

	private loadFile(file: string | Buffer) {
		if (!(typeof file === "string" && file.endsWith(".json")))
			return
		const name = file.slice(0, file.length - 5)
		const collection = this.createCollection(name)
		collection.load()
	}

	getCollection(name: string) {
		const collection = this.collections[name]
		return collection ?? this.createCollection(name)
	}

	createCollection(name: string) {
		const collection = new Collection(name)
		this.collections[name] = collection
		return collection
	}

	saveCollections() {
		for (const name in this.collections)
			this.collections[name].save()
	}
}
