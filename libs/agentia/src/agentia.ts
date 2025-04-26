import { AgEngine, GameGrid } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Config } from "./agentia-config"
import { MoveLogic, UpdateAgentsLogic, UpdateWorldLogic } from "./agentia-logic"
import { State } from "./agentia-state"

export class Agentia {
	private engine: AgEngine<any>

	constructor(
		public config = new Config(20, 20),
		public state = new State(config),
	) {
		this.engine = new AgEngine<any>(
			[
				new UpdateWorldLogic(this.config),
				new UpdateAgentsLogic(this.config, this.state),
				new MoveLogic(this.state),
			],
			[],
			this.state)
	}

	setup() {
		this.state.world = new GameGrid<any>(this.config.width, this.config.height, () => 0)
		this.state.agents = []
		this.config.configure()
		this.config.setup()
	}

	update() {
		this.engine.update()
	}

	resize(width: number, height: number) {
		this.config.width = width
		this.config.height = height
		this.state.world = new GameGrid<any>(width, height, () => 0)
	}

	updateCode(
		configure: string | null = null,
		setup: string | null = null,
		update: string | null = null,
		agentSetup: string | null = null,
		agentUpdate: string | null = null,
		click: string | null = null,
	) {
		if (configure)
			this.updateConfigure(configure)
		if (setup)
			this.updateSetup(setup)
		if (update)
			this.updateUpdate(update)
		if (agentSetup)
			this.updateAgentSetup(agentSetup)
		if (agentUpdate)
			this.updateAgentUpdate(agentUpdate)
		if (click)
			this.updateClick(click)
	}

	private updateConfigure(code: string) {
		code = "'use strict'; return function(){" + code + "}"
		this.config.configure = Function("config", "Vector", code)(this.config, Vector2)
	}

	private updateSetup(code: string) {
		code = "'use strict'; return function(){" + code + "}"
		this.config.setup = Function("state", "config", "Vector", code)(this.state, this.config, Vector2)
	}

	private updateUpdate(code: string) {
		code = "'use strict'; return function(){" + code + "}"
		this.config.update = Function("state", "config", "Vector", code)(this.state, this.config, Vector2)
	}

	private updateAgentSetup(code: string) {
		code = "'use strict'; return function(agent, parameters){" + code + "}"
		this.config.agentSetup = Function("state", "config", "Vector", code)(this.state, this.config, Vector2)
	}

	private updateAgentUpdate(code: string) {
		code = "'use strict'; return function(agent){" + code + "}"
		this.config.agentUpdate = Function("state", "config", "Vector", code)(this.state, this.config, Vector2)
	}

	private updateClick(code: string) {
		code = "'use strict'; return function(x, y){" + code + "}"
		this.config.click = Function("state", "config", "Vector", code)(this.state, this.config, Vector2)
	}
}
