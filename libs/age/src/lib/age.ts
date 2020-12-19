export class AgEngine {
	state: GameState

	constructor(
		private readonly persistenceProvider: PersistenceProvider,
		private readonly config: GameConfig,
		private readonly logics: GameLogic[],
	) {
		this.state = GameState.FromConfig(config)
	}

	update(...actions: GameAction[]) {
		this.state.Tick++
		this.state.Actions.AddRange(actions)
		for (const logic in this.logics)
			logic.Update()
		this.state.FinishUpdate()
	}
}

interface GameState { }
interface GameConfig { }
interface GameLogic { }
interface PersistenceProvider { }
interface GameAction { }
