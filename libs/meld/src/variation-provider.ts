import { Block, Blocks, SolidId } from "./state/block"

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
		public NorthBorder: Block | null = null,
		public EastBorder: Block | null = null,
		public SouthBorder: Block | null = null,
		public WestBorder: Block | null = null,
	) { }

	public UpdateBorderInfo() {
		const type = Blocks.TypeOf(this.Block)
		this.NorthBorder = Blocks.TypeOf(this.NorthBlock) === type ? Blocks.SolidOf(this.NorthBlock) : null
		this.EastBorder = Blocks.TypeOf(this.EastBlock) === type ? Blocks.SolidOf(this.EastBlock) : null
		this.SouthBorder = Blocks.TypeOf(this.SouthBlock) === type ? Blocks.SolidOf(this.SouthBlock) : null
		this.WestBorder = Blocks.TypeOf(this.WestBlock) === type ? Blocks.SolidOf(this.WestBlock) : null
	}
}
