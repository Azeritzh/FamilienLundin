import { Subject } from "rxjs"
import { auditTime } from "rxjs/operators"
import { StorageService } from "./storage.service"

type Change<T> = ((e: T) => void) | { [key: string]: any }

export class Collection<T extends { _id?: number }> {
	private tempStore: { [id: string]: T } = {}
	private update$ = new Subject()

	constructor(
		public readonly name: string,
		private readonly storageService: StorageService,
	) {
		this.load()
		this.update$.pipe(auditTime(30000))
			.subscribe(() => this.save())
	}

	private async load() {
		this.tempStore = await this.storageService.loadJsonFile(this.name)
	}

	save() {
		this.storageService.saveJsonFile(this.name, this.tempStore)
	}

	insertOne(entry: T) {
		entry._id = this.generateId()
		this.tempStore[entry._id] = entry
		this.update$.next()
		return entry
	}

	insertMany(entries: T[]) {
		return entries.map(x => this.insertOne(x))
	}

	updateOne(query, changes: Change<T>) {
		const entry = this.findOne(query)
		this.makeChanges(entry, changes)
		return entry
	}

	updateMany(query, changes: Change<T>) {
		const entries = this.find(query)
		for (const entry of entries)
			this.makeChanges(entry, changes)
		return entries
	}

	private makeChanges(entry: T, changes: Change<T>) {
		if (typeof changes === "function")
			changes(entry)
		else
			for (const key in changes)
				entry[key] = changes[key]
		this.update$.next()
	}

	deleteOne(query) {
		const entry = this.findOne(query)
		delete this.tempStore[entry._id]
		this.update$.next()
	}

	deleteMany(query) {
		const entries = this.find(query)
		for (const entry of entries)
			delete this.tempStore[entry._id]
		this.update$.next()
	}

	find(query?) {
		const entries = Object.values(this.tempStore)
		if (!query)
			return entries
		return entries.filter(x => {
			for (const key in query)
				if (x[key] !== query[key])
					return false
			return true
		})
	}

	findOne(query?) {
		const entries = Object.values(this.tempStore)
		if (!query)
			return entries[0]
		return entries.find(x => {
			for (const key in query)
				if (x[key] !== query[key])
					return false
			return true
		})
	}

	count() {
		return Object.keys(this.tempStore).length
	}

	private generateId() {
		return Math.ceil(Math.random() * 1000000)
	}
}
