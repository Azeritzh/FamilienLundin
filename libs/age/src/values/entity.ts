export type Id = number
export type TypeId = number

// The type is a part of the entity id, and this is the mask for it
export const EntityTypeMask = 0xFF000000
export const EntityTypeOffset = 24 // number of bits to the right of the type

export function EntityTypeOf(entity: Id): TypeId {
	return entity & EntityTypeMask
}
