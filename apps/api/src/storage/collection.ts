import * as fs from "fs"

type Change = ((e: any) => void) | { [key: string]: any }

export class Collection {
	tempStore: { [id: string]: Entry } = {}
	hasChanged = false

	constructor(public readonly name: string) { }

	load() {
		fs.readFile(
			"./storage/" + this.name + ".json",
			"utf-8",
			(error, data) => {
				if (error)
					console.log(error)
				this.tempStore = JSON.parse(data)
				this.hasChanged = false
			})
	}

	save() {
		if (!this.hasChanged)
			return
		fs.writeFile(
			"./storage/" + this.name + ".json",
			JSON.stringify(this.tempStore),
			{ encoding: "utf-8" },
			error => {
				if (error)
					console.log(error)
				this.hasChanged = false
			})
	}

	insertOne(entry) {
		entry._id = this.generateId()
		this.tempStore[entry._id] = entry
		this.onUpdate()
		return entry
	}

	insertMany(entries: unknown[]) {
		return entries.map(x => this.insertOne(x))
	}

	updateOne(query, changes: Change) {
		const entry = this.findOne(query)
		this.makeChanges(entry, changes)
		return entry
	}

	updateMany(query, changes: Change) {
		const entries = this.find(query)
		for (const entry of entries)
			this.makeChanges(entry, changes)
		return entries
	}

	private makeChanges(entry, changes: Change) {
		if (typeof changes === "function")
			changes(entry)
		else
			for (const key in changes)
				entry[key] = changes[key]
		this.onUpdate()
	}

	deleteOne(query) {
		const entry = this.findOne(query)
		delete this.tempStore[entry._id]
		this.onUpdate()
	}

	deleteMany(query) {
		const entries = this.find(query)
		for (const entry of entries)
			delete this.tempStore[entry._id]
		this.onUpdate()
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

	private onUpdate() {
		this.hasChanged = true
		this.save() // TODO
	}
}

interface Entry {
	_id: number
	[key: string]: any
}
