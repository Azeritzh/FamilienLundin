import { Vector3 } from "@lundin/utility"
import { Block, BlockType } from "../../state/block"

export class BlockContext {
	public CurrentAlpha = 1
	public AnimationStart = 0
	public Block!: Block
	public BlockType!: BlockType
	public Position = new Vector3(0, 0, 0)

	public TopBlock!: Block
	public TopRightBlock!: Block
	public RightBlock!: Block
	public BottomRightBlock!: Block
	public BottomBlock!: Block
	public BottomLeftBlock!: Block
	public LeftBlock!: Block
	public TopLeftBlock!: Block
}
