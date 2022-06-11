export {} // in order for this to be a module that can be imported

declare global {
	interface Array<T> {
		sum(): number
		max(): number
		min(): number
		clear(): void
		first(): T
		last(): T
		distinct(): Array<T>
		distinctBy(transform: (entry: T) => any): Array<T>
		sortBy(transform: (entry: T) => any, ascending?: boolean): Array<T>
		includesAny(things: Array<T>): boolean
		groupBy(grouping: (entry: T) => any): Array<{ group: any, entries: T[] }>

		/** Removes the first occurrence of the given value in an array */
		remove(entry: T): boolean

		/** Finds the first element where the predicate is true, and removes it from the array. Returns true if something was found. */
		findAndRemove(predicate: (entry: T) => boolean): boolean

		/** Removes elements from an array based on a predicate, returning the deleted elements.  */
		removeBy(predicate: (entry: T) => boolean): T[]
	}
}

Object.defineProperty(Array.prototype, "sum", {
	value: function () {
		return this.reduce((previous, current) => previous + +current, 0)
	}
})

Object.defineProperty(Array.prototype, "max", {
	value: function () {
		if (!this.length)
			throw new Error("Cannot find the max value in an empty array")
		return this.reduce((previous, current) => previous > current ? previous : current)
	}
})

Object.defineProperty(Array.prototype, "min", {
	value: function () {
		if (!this.length)
			throw new Error("Cannot find the min value in an empty array")
		return this.reduce((previous, current) => previous < current ? previous : current)
	}
})

Object.defineProperty(Array.prototype, "clear", {
	value: function () {
		return this.splice(0, this.length)
	}
})

Object.defineProperty(Array.prototype, "first", {
	value: function () {
		return this[0]
	}
})

Object.defineProperty(Array.prototype, "last", {
	value: function () {
		return this[this.length - 1]
	}
})

Object.defineProperty(Array.prototype, "distinct", {
	value: function () {
		return this.filter((e, i) => this.indexOf(e) === i)
	}
})

Object.defineProperty(Array.prototype, "distinctBy", {
	value: function (transform: (entry: any) => boolean) {
		const isFirstInstance = (e: any, i: number) => {
			const base = transform(e)
			return this.findIndex(x => transform(x) === base) === i
		}
		return this.filter(isFirstInstance)
	}
})

Object.defineProperty(Array.prototype, "sortBy", {
	value: function (transform: (entry: any) => any, ascending = true) {
		const compareFunction = (a: any, b: any) => {
			let propertyA = transform(a)
			if (typeof propertyA === "string")
				propertyA = propertyA.toLowerCase()
			let propertyB = transform(b)
			if (typeof propertyB === "string")
				propertyB = propertyB.toLowerCase()

			if (propertyA > propertyB)
				return ascending ? 1 : -1
			if (propertyA < propertyB)
				return ascending ? -1 : 1
			return 0
		}
		return this.sort(compareFunction)
	}
})

Object.defineProperty(Array.prototype, "includesAny", {
	value: function (things: any[]) {
		return this.some(x => things.includes(x))
	}
})

Object.defineProperty(Array.prototype, "groupBy", {
	value: function (grouping: (entry: any) => any) {
		const groups = []
		for (const entry of this) {
			const groupKey = grouping(entry)
			let group = groups.find(x => x.group === groupKey)
			if (!group) {
				group = { group: groupKey, entries: [] }
				groups.push(group)
			}
			group.entries.push(entry)
		}
		return groups
	}
})

Object.defineProperty(Array.prototype, "remove", {
	value: function (entry: any) {
		const index = this.indexOf(entry)
		if (!(index >= 0))
			return false
		this.splice(index, 1)
		return true
	}
})

Object.defineProperty(Array.prototype, "findAndRemove", {
	value: function (callback: (entry: any) => boolean) {
		const index = this.findIndex(callback)
		if (!(index >= 0))
			return false
		this.splice(index, 1)
		return true
	}
})

Object.defineProperty(Array.prototype, "removeBy", {
	value: function (callback: (entry: any) => boolean) {
		const deleted = []
		for (let i = 0; i < this.length; i++) {
			const remove = callback(this[i])
			if (!remove)
				continue
			deleted.push(...this.splice(i, 1))
			i--
		}
		return deleted
	}
})
