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
	name: string
	information: { [key: string]: string }
}
