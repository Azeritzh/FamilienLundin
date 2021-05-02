import { GameLogic } from "@lundin/age"
import { Config } from "./agentia-config"
import { Agent, State } from "./agentia-state"


export class UpdateWorldLogic implements GameLogic<any> {
	constructor(
		private config: Config,
		private state: State,
	) { }

	update() {
		this.config.update(this.state, this.config)
	}
}

export class UpdateAgentsLogic implements GameLogic<any> {
	constructor(
		private config: Config,
		private state: State,
	) { }

	update() {
		for (const agent of this.state.agents)
			this.config.agentUpdate(agent, this.state, this.config)
	}
}

export class MoveLogic implements GameLogic<any> {
	constructor(private state: State) { }

	update() {
		for (const agent of this.state.agents)
			this.moveAgent(agent)
	}

	private moveAgent(agent: Agent) {
		if (agent.velocity.lengthSquared() === 0)
			return
		agent.position = agent.position.add(agent.velocity)
	}
}

