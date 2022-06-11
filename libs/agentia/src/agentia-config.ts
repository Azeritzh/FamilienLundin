import { Agent } from "./agentia-state"

export class Config {
	constructor(
		public width: number,
		public height: number,
		public configure: () => void = () => { return },
		public setup: () => void = () => { return },
		public update: () => void = () => { return },
		public agentSetup: (agent: Agent, parameters: { [index: string]: any }) => void = () => { return },
		public agentUpdate: (agent: Agent) => void = () => { return },
		public click: (x: number, y: number) => void = () => { return },
	) { }
}
