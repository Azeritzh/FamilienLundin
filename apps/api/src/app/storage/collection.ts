export class Collection {
	tempStore: { [id: string]: Entry } = {}

	insertOne(entry) {
		entry._id = this.generateId()
		this.tempStore[entry._id] = entry
		return entry
	}

	insertMany(entries: unknown[]) {
		return entries.map(x => this.insertOne(x))
	}

	updateOne(query, changes) {
		const entry = this.findOne(query)
		this.makeChanges(entry, changes)
		return entry
	}

	updateMany(query, changes) {
		const entries = this.find(query)
		for (const entry of entries)
			this.makeChanges(entry, changes)
		return entries
	}

	private makeChanges(entry, changes) {
		for (const key in changes)
			entry[key] = changes[key]
	}

	deleteOne(query) {
		const entry = this.findOne(query)
		delete this.tempStore[entry._id]
	}

	deleteMany(query) {
		const entries = this.find(query)
		for (const entry of entries)
			delete this.tempStore[entry._id]
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

	private generateId() {
		return Math.ceil(Math.random() * 1000000)
	}
}

interface Entry {
	_id: number
	[key: string]: unknown
}
