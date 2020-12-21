import { AgEngine } from "@lundin/age"
import { VirusConfig } from "./virus-config"
import { VirusAction, VirusLogic } from "./virus-logic"
import { VirusState } from "./virus-state"

export class Virus {
	readonly config: VirusConfig
	readonly state: VirusState
	private readonly engine: AgEngine<VirusAction>

	constructor() {
		this.config = new VirusConfig()
		this.state = new VirusState(this.config)
		this.engine = new AgEngine(
			[new VirusLogic(this.state)],
			this.state)
	}

	update(action: VirusAction) {
		const validation = VirusLogic.validate(this.state, action)
		if (validation.isValid)
			this.engine.update(action)
		return validation
	}
}
