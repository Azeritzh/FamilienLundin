import { BaseChanges, BaseGame, EntityManager, Id, TerrainManager, ValueAccessor } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { StartLogic } from "./logic/start-logic"
import { MeldConfig } from "./meld-config"
import { MeldConstants } from "./meld-constants"
import { Block } from "./state/block"
import { BlockValues } from "./state/block-values"
import { Behaviour, EntityValues, GroupedEntityValues } from "./state/entity-values"
import { Globals } from "./state/globals"
import { MeldAction } from "./state/meld-action"
import { MeldState } from "./state/meld-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config = new MeldConfig(new MeldConstants(), new Map<Id, GroupedEntityValues>(), new Map<Id, Behaviour[]>(), new Map<Id, BlockValues>()),
		public readonly state = new MeldState(new Globals(), new EntityValues()),
		public readonly changes = new BaseChanges<EntityValues, Block>(new EntityValues()),
		public readonly terrain = new TerrainManager(config, state, changes),
		public readonly entities = new EntityManager(config, state, changes),
		public readonly access = new Access(config, state, changes),
	) {
		super([
			new StartLogic(config, terrain),
		])
	}

	finishUpdate() {
		this.state.globals.tick++
		this.entities.applyUpdatedValues()
		this.terrain.applyUpdatedValues()
	}
}

class Access {
	constructor(
		config: MeldConfig,
		state: MeldState,
		changes: BaseChanges<EntityValues, Block>,
		public readonly size = ValueAccessor.For(config, state, changes, x => x.rectangularSize, x => x.rectangularSize),
		public readonly health = ValueAccessor.For(config, state, changes, x => x.health, x => x.health),
		public readonly orientation = ValueAccessor.For(config, state, changes, x => x.orientation, x => x.orientation, 0),
		public readonly position = ValueAccessor.For(config, state, changes, x => x.position, x => x.position),
		public readonly velocity = ValueAccessor.For(config, state, changes, x => x.velocity, x => x.velocity, new Vector2(0, 0)),
	) { }
}
