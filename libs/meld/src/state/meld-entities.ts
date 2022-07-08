import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { EntityValues, GroupedEntityValues } from "./entity-values"

export class MeldEntities extends EntityManager<EntityValues> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly health = accessor.for(x => x.health, x => x.health),
		public readonly orientation = accessor.for(x => x.orientation, x => x.orientation, 0),
		public readonly position = accessor.for(x => x.position, x => x.position),
		public readonly circularSize = accessor.for(x => x.circularSize, x => x.circularSize),
		public readonly selectedBlock = accessor.for(x => x.selectedBlock, x => x.selectedBlock),
		public readonly velocity = accessor.for(x => x.velocity, x => x.velocity),
		public readonly blockCollisionBehaviour = accessor.for(x => x.blockCollisionBehaviour, x => x.blockCollisionBehaviour),
	) {
		super(entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			health,
			orientation,
			position,
			circularSize,
			selectedBlock,
			velocity,
			blockCollisionBehaviour,
		)
	}
}
