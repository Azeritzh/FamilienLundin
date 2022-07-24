import { EntityManager, Id, IdProvider, ValueAccessBuilder } from "@lundin/age"
import { EntityValues, GroupedEntityValues } from "./entity-values"

export class MeldEntities extends EntityManager<EntityValues> {
	constructor(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		idProvider: IdProvider,
		accessor = new ValueAccessBuilder(typeValues, entityValues, updatedEntityValues),
		public readonly CircularSize = accessor.For(x => x.CircularSize, x => x.CircularSize),
		public readonly DashState = accessor.For(x => x.DashState, x => x.DashState),
		public readonly Health = accessor.For(x => x.Health, x => x.Health),
		public readonly Orientation = accessor.For(x => x.Orientation, x => x.Orientation, 0),
		public readonly Position = accessor.For(x => x.Position, x => x.Position),
		public readonly SelectableItems = accessor.For(x => x.SelectableItems, x => x.SelectableItems),
		public readonly TargetVelocity = accessor.For(x => x.TargetVelocity, x => x.TargetVelocity),
		public readonly Velocity = accessor.For(x => x.Velocity, x => x.Velocity),
		public readonly BlockCollisionBehaviour = accessor.For(x => x.BlockCollisionBehaviour, x => x.BlockCollisionBehaviour),
		public readonly GravityBehaviour = accessor.For(x => x.GravityBehaviour, x => x.GravityBehaviour),
	) {
		super(entityValues, updatedEntityValues, idProvider)
		this.valueAccessors.push(
			CircularSize,
			DashState,
			Health,
			Orientation,
			Position,
			SelectableItems,
			TargetVelocity,
			Velocity,
			BlockCollisionBehaviour,
			GravityBehaviour,
		)
	}
}
