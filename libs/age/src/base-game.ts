import { GameLogic } from "./interfaces/game-logic"
import { GameValidator, Validation } from "./interfaces/game-validator"

export abstract class BaseGame<GameAction> {
	constructor(
		private readonly logics: GameLogic<GameAction>[] = [],
		private readonly validators: GameValidator<GameAction>[] = [],
	) { }

	update(...actions: GameAction[]): Validation {
		const problems = this.validate(actions)
		if (problems)
			return problems
		for (const logic of this.logics)
			logic.update(actions)
		return { isValid: true, problems: [] }
	}

	private validate(actions: GameAction[]) {
		for (const validator of this.validators) {
			const validation = validator.validate(actions)
			if (!validation.isValid)
				return validation
		}
	}
}
