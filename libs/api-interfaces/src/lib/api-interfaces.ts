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

export interface User {
  _id: string
  name: string
}

export interface AuthResponse {
  userId: number
  expiration: number
  username: string
  type: "admin" | "member" | "guest"
}
