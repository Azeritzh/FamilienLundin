export type Block = number
export type SolidId = number
export type NonSolidId = number

const TypeMask = 0x00000003
//const TypeOffset = 0
export const VariantMask = 0x000000FC
export const VariantOffset = 2
export const SolidMask = 0x00FFFF00
export const SolidOffset = 8
export const NonSolidMask = 0xFF000000
export const NonSolidOffset = 24

export class Blocks {
	public static New(type: BlockType, solid: SolidId, nonSolid: NonSolidId, variant = 0): Block {
		return nonSolid | solid | variant << VariantOffset | type
	}

	public static NewEmpty(nonSolidType: NonSolidId, variant = 0): Block {
		return Blocks.New(BlockType.Empty, 0, nonSolidType, variant)
	}

	public static NewFloor(solidType: SolidId, nonSolidType: NonSolidId, variant = 0): Block {
		return Blocks.New(BlockType.Floor, solidType, nonSolidType, variant)
	}

	public static NewHalf(solidType: SolidId, nonSolidType: NonSolidId, variant = 0): Block {
		return Blocks.New(BlockType.Half, solidType, nonSolidType, variant)
	}

	public static NewFull(solidType: SolidId, variant = 0): Block {
		return Blocks.New(BlockType.Full, solidType, 0, variant)
	}

	public static TypeOf(block: Block): BlockType {
		if (block === null)
			return null
		return <BlockType>(block & TypeMask) // skipping the shift, since there's no actual offset right now
	}

	public static VariantOf(block: Block) {
		if (block === null)
			return null
		return (block & VariantMask) >> VariantOffset
	}

	public static SolidOf(block: Block): SolidId {
		if (block === null)
			return null
		return block & SolidMask
	}

	public static NonSolidOf(block: Block): NonSolidId {
		if (block === null)
			return null
		return block & NonSolidMask
	}

	public static HasSolid(block: Block) {
		if (block === null)
			return null
		return Blocks.TypeOf(block) != BlockType.Empty
	}


	public static HasNonSolid(block: Block) {
		if (block === null)
			return null
		return Blocks.TypeOf(block) != BlockType.Full
	}
}

export enum BlockType { Empty = 0, Floor = 1, Half = 2, Full = 3 }
