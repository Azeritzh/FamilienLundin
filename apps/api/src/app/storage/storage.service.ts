import { Injectable } from "@nestjs/common"
import { Collection } from "./collection"

@Injectable()
export class StorageService {
	private collections: { [name: string]: Collection } = {}

	getCollection(name: string) {
		const collection = this.collections[name]
		return collection ?? this.createCollection(name)
	}

	createCollection(name: string) {
		const collection = new Collection()
		this.collections[name] = collection
		return collection
	}
}
