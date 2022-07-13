import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { EntityValues, GroupedEntityValues } from "./entity-values"

export class RenderendEntities extends EntityManager<EntityValues> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly bulletType = accessor.For(x => x.bulletType, x => x.bulletType),
		public readonly charge = accessor.For(x => x.charge, x => x.charge),
		public readonly damage = accessor.For(x => x.damage, x => x.damage),
		public readonly health = accessor.For(x => x.health, x => x.health),
		public readonly orientation = accessor.For(x => x.orientation, x => x.orientation, 0),
		public readonly position = accessor.For(x => x.position, x => x.position),
		public readonly rectangularSize = accessor.For(x => x.rectangularSize, x => x.rectangularSize),
		public readonly velocity = accessor.For(x => x.velocity, x => x.velocity),
		public readonly shipBehaviour = accessor.For(x => x.shipBehaviour, x => x.shipBehaviour),
		public readonly obstacleBehaviour = accessor.For(x => x.obstacleBehaviour, x => x.obstacleBehaviour),
		public readonly dieOnCollisionBehaviour = accessor.For(x => x.dieOnCollisionBehaviour, x => x.dieOnCollisionBehaviour),
	) {
		super(entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			bulletType,
			charge,
			damage,
			health,
			orientation,
			position,
			rectangularSize,
			velocity,
			shipBehaviour,
			obstacleBehaviour,
			dieOnCollisionBehaviour,
		)
	}
}
