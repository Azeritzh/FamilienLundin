import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { Behaviour, EntityValues, GroupedEntityValues } from "./entity-values"

export class RenderendEntities extends EntityManager<EntityValues, Behaviour> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		typeBehaviours: Map<Id, Behaviour[]>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly rectangularSize = accessor.for(x => x.rectangularSize, x => x.rectangularSize),
		public readonly health = accessor.for(x => x.health, x => x.health),
		public readonly orientation = accessor.for(x => x.orientation, x => x.orientation, 0),
		public readonly position = accessor.for(x => x.position, x => x.position),
		public readonly velocity = accessor.for(x => x.velocity, x => x.velocity),
	) {
		super(typeBehaviours, entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			rectangularSize,
			health,
			orientation,
			position,
			velocity,
		)
	}
}
