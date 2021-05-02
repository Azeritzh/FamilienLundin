import { GameGrid, GameState } from "@lundin/age"
import { Config } from "./agentia-config"

export class State implements GameState {
	constructor(
		config: Config,
		public world = new GameGrid<any>(config.width, config.height, () => 0),
		public agents: Agent[] = [],
		public tick = 0,
	) { }

	newAgent(config: Config, parameters: { [index: string]: any }) {
		const agent = new Agent()
		config.agentSetup(agent, this, config, parameters)
		this.agents.push(agent)
		return agent
	}

	removeAgent(agent: Agent) {
		const index = this.agents.indexOf(agent)
		if (index >= 0)
			this.agents.splice(index, 1)
	}
}

export class Agent {

}
