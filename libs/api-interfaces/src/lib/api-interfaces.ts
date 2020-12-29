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
	fatherId?: number
	motherId?: number
	relations: PersonalRelation[]
}

export interface PersonalRelation {
	type: "child" | "partner"
	id: number
	description: string
}

export interface TopScoreSet {
	beginnerFlags: TopScore[]
	trainedFlags: TopScore[]
	expertFlags: TopScore[]
	beginnerNoFlags: TopScore[]
	trainedNoFlags: TopScore[]
	expertNoFlags: TopScore[]
}

export interface TopScore {
	userId: number
	time: number
	date: string
}

export interface NewScore {
	type: string
	time: number
	date: string
}
