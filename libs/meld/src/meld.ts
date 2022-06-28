import { BaseGame, Random, TerrainManager } from "@lundin/age"
import { StartLogic } from "./logic/start-logic"
import { UpdateStateLogic } from "./logic/update-state-logic"
import { MeldConfig } from "./meld-config"
import { EntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { MeldAction } from "./state/meld-action"
import { MeldChanges } from "./state/meld-changes"
import { MeldEntities } from "./state/meld-entities"
import { MeldState } from "./state/meld-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config: MeldConfig,
		public readonly state = new MeldState(new Globals(), new EntityValues()),
		public readonly changes = new MeldChanges(new EntityValues()),
		public readonly terrain = new TerrainManager(config.constants.chunkSize, state.chunks, changes.updatedBlocks),
		public readonly entities = new MeldEntities(config.typeValues, state.entityValues, changes.updatedEntityValues, state),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
	) {
		super([
			new StartLogic(config, terrain, random),
			new UpdateStateLogic(state, entities, terrain),
		])
	}
}
