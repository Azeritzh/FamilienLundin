export interface AuthResponse {
  userId: number
  expiration: number
  username: string
  type: "admin" | "member" | "guest"
}
