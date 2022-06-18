import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { EntityValues, GroupedEntityValues } from "./entity-values"

export class RenderendEntities extends EntityManager<EntityValues> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly rectangularSize = accessor.for(x => x.rectangularSize, x => x.rectangularSize),
		public readonly health = accessor.for(x => x.health, x => x.health),
		public readonly orientation = accessor.for(x => x.orientation, x => x.orientation, 0),
		public readonly position = accessor.for(x => x.position, x => x.position),
		public readonly velocity = accessor.for(x => x.velocity, x => x.velocity),
		public readonly shipBehaviour = accessor.for(x => x.shipBehaviour, x => x.shipBehaviour),
		public readonly obstacleBehaviour = accessor.for(x => x.obstacleBehaviour, x => x.obstacleBehaviour),
		public readonly dieOnCollisionBehaviour = accessor.for(x => x.dieOnCollisionBehaviour, x => x.dieOnCollisionBehaviour),
	) {
		super(entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			rectangularSize,
			health,
			orientation,
			position,
			velocity,
			shipBehaviour,
			obstacleBehaviour,
			dieOnCollisionBehaviour,
		)
	}
}