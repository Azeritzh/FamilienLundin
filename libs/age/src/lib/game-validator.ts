export interface GameValidator<GameAction> {
	validate(actions: GameAction[]): Validation
}

export interface Validation {
	isValid: boolean
	problems: string[]
}
