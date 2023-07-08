import { GameLogic } from "./interfaces/game-logic"
import { GameState } from "./interfaces/game-state"
import { GameValidator, Validation } from "./interfaces/game-validator"

export class AgEngine<GameAction> {
	constructor(
		private readonly logics: GameLogic<GameAction>[],
		private readonly validators: GameValidator<GameAction>[],
		private readonly state: GameState,
	) { }

	update(...actions: GameAction[]): Validation {
		const problems = this.validate(actions)
		if (problems)
			return problems
		this.performLogic(actions)
		return { isValid: true, problems: [] }
	}

	private validate(actions: GameAction[]) {
		for (const validator of this.validators) {
			const validation = validator.validate(actions)
			if (!validation.isValid)
				return validation
		}
	}

	private performLogic(actions: GameAction[]) {
		this.state.tick++
		for (const logic of this.logics)
			logic.Update(actions)
		this.state.finishUpdate?.()
	}
}
