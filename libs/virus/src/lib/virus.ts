import { AgEngine } from "@lundin/age"
import { VirusAction, VirusLogic } from "./virus-logic"
import { VirusState } from "./virus-state"

export class Virus {
	readonly state: VirusState
	private readonly engine: AgEngine<VirusAction>

	constructor() {
		this.state = new VirusState()
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
