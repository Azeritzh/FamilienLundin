export type Id = number
export type TypeId = number

// The type is a part of the entity id, and this is the mask for it
export const entityTypeMask = 0xFF000000
export const entityTypeOffset = 24 // number of bits to the right of the type

export function entityTypeOf(entity: Id): TypeId {
	return entity & entityTypeMask
}
