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

export interface Recipe {
	_id: number
	title: string
	description: string
	time: string
	persons: string
	ingredients: string
	fileId: string
}

export interface Person {
	_id: number
	userId?: number
	name: string
	gender: "male" | "female" | "other"
	relations: PersonalRelation[]
	information: { title: string, content: string }[]
	files: PersonFile[]
}

export interface PersonalRelation {
	type: "parent" | "child" | "partner"
	id: number
}

export interface PersonFile {
	name: string
	description: string
	fileId: string
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

export interface MusicRating {
	_id: number
	userId: number
	ratings: { [trackId: string]: number }
}

export interface MusicRatingUpdate {
	trackId: string
	rating: number
}

export interface MusicPlaylist {
	_id: number
	userId: number
	title: string
	shared: boolean
	content: string[] | string
}
