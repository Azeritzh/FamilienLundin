export interface User {
	_id: number
	name: string
}

export interface AuthResponse {
	userId: number
	expiration: number
	username: string
	type: "admin" | "member" | "guest"
}

export interface MessageThread {
	_id: number
	authorId: number
	title: string
	content: string
	creationTime: string
	participantIds: number[]
	responses: Message[]
}

export interface Message {
	authorId: number
	content: string
	creationTime: string
}

export interface CalendarEvent {
	_id: number
	title: string
	description: string
	date: string
	startTime: string
	endTime: string
	participantIds: number[]
}

export interface Person {
	_id: number
	userId?: number
	name: string
	information: { title: string, content: string }[]
	files: { name: string, description: string, fileId: string, }[]
	fatherId?: number
	motherId?: number
	relations: PersonalRelation[]
}

export interface PersonalRelation {
	type: "child" | "partner"
	id: number
	description: string
}

export interface MinestrygerTopScoreSet {
	year?: string
	beginnerFlags: MinestrygerTopScore[]
	trainedFlags: MinestrygerTopScore[]
	expertFlags: MinestrygerTopScore[]
	beginnerNoFlags: MinestrygerTopScore[]
	trainedNoFlags: MinestrygerTopScore[]
	expertNoFlags: MinestrygerTopScore[]
}

export interface MinestrygerScore {
	time: number
	date: string
}

export interface MinestrygerTopScore extends MinestrygerScore {
	userId: number
}

export interface NewMinestrygerScore extends MinestrygerScore {
	type: string
}

export interface MinestrygerScoreSet {
	_id: number
	userId: number
	categories: { [category: string]: MinestrygerScore[] }
}
