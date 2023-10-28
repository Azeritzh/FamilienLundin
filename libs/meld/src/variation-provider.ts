import { Block, SolidId } from "./state/block"

export interface VariationProvider {
	HasVariation(solid: SolidId): boolean
	GetVariationFor(surroundings: BlockSurroundings, random: number): number
}

export class BlockSurroundings {
	constructor(
		public Block: Block,
		public NorthBlock: Block,
		public EastBlock: Block,
		public SouthBlock: Block,
		public WestBlock: Block,
	) { }
}
