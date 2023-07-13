import { GameLogic } from "./interfaces/game-logic"
import { GameValidator } from "./interfaces/game-validator"

export abstract class BaseGame<GameAction> {
	constructor(
		protected readonly Logics: GameLogic<GameAction>[] = [],
		protected readonly Validators: GameValidator<GameAction>[] = [],
	) { }

	Update(...actions: GameAction[]): string[] {
		const problems = this.Validate(actions)
		if (problems)
			return problems
		for (const logic of this.Logics)
			logic.Update(actions)
		return null
	}

	private Validate(actions: GameAction[]) {
		for (const validator of this.Validators) {
			const problems = validator.validate(actions)
			if (problems)
				return problems
		}
	}
}
