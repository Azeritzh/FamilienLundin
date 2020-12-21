import { AgEngine } from "@lundin/age"
import { ActionValidator } from "./action-validator"
import { ChangePlayerLogic } from "./logics/change-player-logic"
import { MoveLogic } from "./logics/move-logic"
import { TurnLogic } from "./logics/turn-logic"
import { VirusAction } from "./virus-action"
import { VirusConfig } from "./virus-config"
import { VirusState } from "./virus-state"

export class Virus {
	readonly config: VirusConfig
	readonly state: VirusState
	private readonly engine: AgEngine<VirusAction>

	constructor() {
		this.config = new VirusConfig()
		this.state = new VirusState(this.config)
		this.engine = new AgEngine(
			[
				new MoveLogic(this.config, this.state),
				new TurnLogic(this.config, this.state),
				new ChangePlayerLogic(this.config, this.state),
			],
			this.state)
	}

	update(action: VirusAction) {
		const validation = new ActionValidator(this.config, this.state).validate(action)
		if (validation.isValid)
			this.engine.update(action)
		return validation
	}
}
