import { AgEngine, GameGrid } from "@lundin/age"
import { Config } from "./agentia-config"
import { UpdateAgentsLogic, UpdateWorldLogic } from "./agentia-logic"
import { State } from "./agentia-state"

export class Agentia {
	private engine: AgEngine<any>

	constructor(
		public config = new Config(20, 20),
		public state = new State(config),
	) {
		this.engine = new AgEngine<any>(
			[
				new UpdateWorldLogic(this.config, this.state),
				new UpdateAgentsLogic(this.config, this.state),
				// new MoveLogic(this.config, this.state),
			],
			[],
			this.state)
	}

	setup() {
		this.config.setup(this.state, this.config)
	}

	update() {
		this.engine.update()
	}

	resize(width: number, height: number) {
		this.config.width = width
		this.config.height = height
		this.state.world = new GameGrid<any>(width, height, () => 0)
	}

	updateConfig(
		setup: string = null,
		update: string = null,
		agentSetup: string = null,
		agentUpdate: string = null,
	) {
		if (setup)
			this.updateSetup(setup)
		if (update)
			this.updateUpdate(update)
		if (agentSetup)
			this.updateAgentSetup(agentSetup)
		if (agentUpdate)
			this.updateAgentUpdate(agentUpdate)
	}

	private updateSetup(code: string) {
		code = "'use strict'; return function(state, config){" + code + "}"
		this.config.setup = Function(code)()
	}

	private updateUpdate(code: string) {
		code = "'use strict'; return function(state, config){" + code + "}"
		this.config.update = Function(code)()
	}

	private updateAgentSetup(code: string) {
		code = "'use strict'; return function(agent, state, config, parameters){" + code + "}"
		this.config.agentSetup = Function(code)()
	}

	private updateAgentUpdate(code: string) {
		code = "'use strict'; return function(agent, state, config){" + code + "}"
		this.config.agentUpdate = Function(code)()
	}
}
