import { GameLogic } from "./interfaces/game-logic"
import { GameValidator, Validation } from "./interfaces/game-validator"

export abstract class BaseGame<GameAction> {
	constructor(
		protected readonly Logics: GameLogic<GameAction>[] = [],
		protected readonly Validators: GameValidator<GameAction>[] = [],
	) { }

	Update(...actions: GameAction[]): Validation {
		const problems = this.Validate(actions)
		if (problems)
			return problems
		for (const logic of this.Logics)
			logic.Update(actions)
		return { isValid: true, problems: [] }
	}

	private Validate(actions: GameAction[]) {
		for (const validator of this.Validators) {
			const validation = validator.validate(actions)
			if (!validation.isValid)
				return validation
		}
	}
}
