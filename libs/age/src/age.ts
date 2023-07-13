import { GameLogic } from "./interfaces/game-logic"
import { GameState } from "./interfaces/game-state"
import { GameValidator } from "./interfaces/game-validator"

export class AgEngine<GameAction> {
	constructor(
		private readonly logics: GameLogic<GameAction>[],
		private readonly validators: GameValidator<GameAction>[],
		private readonly state: GameState,
	) { }

	update(...actions: GameAction[]): string[] {
		const problems = this.validate(actions)
		if (problems)
			return problems
		this.performLogic(actions)
		return null
	}

	private validate(actions: GameAction[]) {
		for (const validator of this.validators) {
			const problems = validator.validate(actions)
			if (problems)
				return problems
		}
	}

	private performLogic(actions: GameAction[]) {
		this.state.tick++
		for (const logic of this.logics)
			logic.Update(actions)
		this.state.finishUpdate?.()
	}
}
