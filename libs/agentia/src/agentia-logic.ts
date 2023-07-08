import { GameLogic } from "@lundin/age"
import { Config } from "./agentia-config"
import { Agent, State } from "./agentia-state"


export class UpdateWorldLogic implements GameLogic<any> {
	constructor(
		private config: Config,
	) { }

	Update() {
		this.config.update()
	}
}

export class UpdateAgentsLogic implements GameLogic<any> {
	constructor(
		private config: Config,
		private state: State,
	) { }

	Update() {
		for (const agent of this.state.agents)
			this.config.agentUpdate(agent)
	}
}

export class MoveLogic implements GameLogic<any> {
	constructor(private state: State) { }

	Update() {
		for (const agent of this.state.agents)
			this.moveAgent(agent)
	}

	private moveAgent(agent: Agent) {
		if (agent.velocity.lengthSquared() === 0)
			return
		agent.position = agent.position.add(agent.velocity)
	}
}

