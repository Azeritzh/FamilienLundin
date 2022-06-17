import { BaseGame, EntityManager, Id, Random, TerrainManager, TypeMap, ValueAccessor } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { StartLogic } from "./logic/start-logic"
import { UpdateStateLogic } from "./logic/update-state-logic"
import { MeldConfig } from "./meld-config"
import { MeldConstants } from "./meld-constants"
import { BlockValues } from "./state/block-values"
import { Behaviour, EntityValues, GroupedEntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { MeldAction } from "./state/meld-action"
import { MeldChanges } from "./state/meld-changes"
import { MeldState } from "./state/meld-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config = new MeldConfig(new MeldConstants(), TypeMap.from(["tile-dirt", "tile-earth", "tile-grass", "tile-slab", "tile-stone", "tile-wooden"]), new Map<Id, GroupedEntityValues>(), new Map<Id, Behaviour[]>(), new Map<Id, BlockValues>()),
		public readonly state = new MeldState(new Globals(), new EntityValues()),
		public readonly changes = new MeldChanges(new EntityValues()),
		public readonly terrain = new TerrainManager(config.chunkSize, state.chunks, changes.updatedBlocks),
		public readonly entities = new EntityManager(config.typeBehaviours, state.entityValues, changes.updatedEntityValues, state),
		public readonly access = new Access(config, state, changes),
		readonly random = new Random(() => state.globals.seed + state.globals.tick),
	) {
		super([
			new StartLogic(config, terrain, random),
			new UpdateStateLogic(state, entities, terrain),
		])
	}
}

class Access {
	constructor(
		config: MeldConfig,
		state: MeldState,
		changes: MeldChanges,
		public readonly size = ValueAccessor.for(config.typeValues, state.entityValues, changes.updatedEntityValues, x => x.rectangularSize, x => x.rectangularSize),
		public readonly health = ValueAccessor.for(config.typeValues, state.entityValues, changes.updatedEntityValues, x => x.health, x => x.health),
		public readonly orientation = ValueAccessor.for(config.typeValues, state.entityValues, changes.updatedEntityValues, x => x.orientation, x => x.orientation, 0),
		public readonly position = ValueAccessor.for(config.typeValues, state.entityValues, changes.updatedEntityValues, x => x.position, x => x.position),
		public readonly velocity = ValueAccessor.for(config.typeValues, state.entityValues, changes.updatedEntityValues, x => x.velocity, x => x.velocity, new Vector2(0, 0)),
	) { }
}
