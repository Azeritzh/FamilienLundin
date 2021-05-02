import { Agent, State } from "./agentia-state"

export class Config {
	constructor(
		public width: number,
		public height: number,
		public setup: (state: State, config: Config) => void = () => { return },
		public update: (state: State, config: Config) => void = () => { return },
		public agentSetup: (agent: Agent, state: State, config: Config, parameters: { [index: string]: any }) => void = () => { return },
		public agentUpdate: (agent: Agent, state: State, config: Config) => void = () => { return },
	) { }
}
