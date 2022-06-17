export type Id = number
// The type is a part of the entity id, and this is the mask for it
export const typeMask = 0xFF000000
export const typeOffset = 24 // number of bits to the right of the type

export function typeOf(entity: Id) {
	return entity & typeMask
}
