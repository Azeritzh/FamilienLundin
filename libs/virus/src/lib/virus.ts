import { AgEngine } from "@lundin/age"
import { ChangePlayerLogic } from "./logics/change-player-logic"
import { MoveLogic } from "./logics/move-logic"
import { TurnLogic } from "./logics/turn-logic"
import { ActionValidator } from "./validators/action-validator"
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
				new MoveLogic(this.state),
				new TurnLogic(this.config, this.state),
				new ChangePlayerLogic(this.config, this.state),
			],
			[new ActionValidator(this.state)],
			this.state)
	}

	update(action: VirusAction) {
		return this.engine.update(action)
	}
}
