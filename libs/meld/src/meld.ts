import { BaseChanges, BaseGame, EntityManager, Id, ValueAccessor } from "@lundin/age"
import { MeldConfig } from "./meld-config"
import { MeldConstants } from "./meld-constants"
import { GroupedBlockValues } from "./state/block-values"
import { Behaviour, EntityValues, GroupedEntityValues } from "./state/entity-values"
import { MeldAction } from "./state/meld-action"
import { MeldState } from "./state/meld-state"

export class Meld extends BaseGame<MeldAction> {
	constructor(
		public readonly config = new MeldConfig(new MeldConstants(), new Map<Id, GroupedEntityValues>(), new Map<Id, Behaviour[]>(), new Map<Id, GroupedBlockValues>()),
		public readonly state = MeldState.fromConfig(config),
		public readonly changes = new BaseChanges(new EntityValues()),
		public readonly entities = new EntityManager(config, state, changes),
		public readonly access = new Access(config, state, changes),
	) {
		super([
			
		])
	}

	finishUpdate() {
		this.state.tick++
		this.entities.applyUpdatedValues()
	}
}

class Access {
	constructor(
		config: MeldConfig,
		state: MeldState,
		changes: BaseChanges<EntityValues>,
		public readonly size = ValueAccessor.For(config, state, changes, x => x.entitySizeValues, x=>x.entitySize),
		public readonly positioning = ValueAccessor.For(config, state, changes, x => x.positioningValues, x => x.positioning),
		public readonly health = ValueAccessor.For(config, state, changes, x => x.healthValues, x => x.health),
	) { }
}
