import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { EntityValues, GroupedEntityValues } from "./entity-values"

export class MeldEntities extends EntityManager<EntityValues> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly Health = accessor.for(x => x.Health, x => x.Health),
		public readonly Orientation = accessor.for(x => x.Orientation, x => x.Orientation, 0),
		public readonly Position = accessor.for(x => x.Position, x => x.Position),
		public readonly CircularSize = accessor.for(x => x.CircularSize, x => x.CircularSize),
		public readonly SelectedBlock = accessor.for(x => x.SelectedBlock, x => x.SelectedBlock),
		public readonly Velocity = accessor.for(x => x.Velocity, x => x.Velocity),
		public readonly BlockCollisionBehaviour = accessor.for(x => x.BlockCollisionBehaviour, x => x.BlockCollisionBehaviour),
		public readonly GravityBehaviour = accessor.for(x => x.GravityBehaviour, x => x.GravityBehaviour),
	) {
		super(entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			Health,
			Orientation,
			Position,
			CircularSize,
			SelectedBlock,
			Velocity,
			BlockCollisionBehaviour,
			GravityBehaviour,
		)
	}
}
