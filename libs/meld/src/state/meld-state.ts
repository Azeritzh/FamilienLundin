import { Block } from "./block"
import { EntityValues } from "./entity-values"
import { Globals } from "./globals"

export class MeldState {
	constructor(
		public readonly globals: Globals,
		public readonly entityValues: EntityValues,
		public readonly chunks = new Map<string, Block[]>(), // Optimally the key would be a Vector3, but it'll use the object reference, so we instead convert it to a string: 1,2,3
	) { }

	getNewId() {
		return this.globals.nextId++
	}
	/*
			void AddNewEntity(SerialisedEntity newEntity) {
		var id = NextId++;
		var entity = TypeMapping.CreateEntity(newEntity.Type, id);
		// The next two calls would do well to be a single call to Entities, and should probably
		// also store the entity in a list for new entities like with the values
		Entities.Add(entity);
		Entities.UpdatedEntityValues.AddValuesFrom(entity.Id, newEntity.Values);
	}*/

	/*public EntityIdForPlayer(playerId: string): number {
		for(const entity of this.entities){
			if(entity instanceof PlayerEntity && entity.playerId === playerId)
				return entity.id
		}
		return null
	}*/
}
