export interface MessageThread {
	_id: number
	title: string
	content: string
	authorId: number
	creationTime: string
	participant: number
	responses: Message[]
}

export interface Message {
	content: string
	authorId: number
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
