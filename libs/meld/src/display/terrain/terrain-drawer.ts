import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Block, Blocks, BlockType } from "../../state/block"
import { Camera } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { BlockContext } from "./block-context"
import { BlockDrawer } from "./block-drawer"

export class TerrainDrawer {
	private BlockContext = new BlockContext()
	private Position = new Vector3(0, 0, 0) // pre-allocated vector

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
		private BlockDrawers: BlockDrawer[],
	) { }

	Draw() {
		for (let x = 0; x < this.State.VisibleBlocks.ChunkSize.x; x++)
			for (let y = 0; y < this.State.VisibleBlocks.ChunkSize.y; y++)
				for (let z = 0; z < this.State.VisibleBlocks.ChunkSize.z; z++)
					if (this.State.VisibleBlocks.GetWithoutOffset(x, y, z))
						this.DrawBlock(this.State.VisibleBlocks.Offset.x + x, this.State.VisibleBlocks.Offset.y + y, this.State.VisibleBlocks.Offset.z + z)
	}

	private DrawBlock(x: number, y: number, z: number) {
		const block = this.Game.Terrain.Get(x, y, z)
		if (block === null || block === undefined)
			return
		if (Blocks.TypeOf(block) == BlockType.Empty)
			return
		this.Position.set(x, y, z)
		this.UpdateContext(block, x, y, z)
		for (const drawer of this.BlockDrawers)
			drawer.Draw(this.BlockContext)
	}

	private _adjustableUpdateContext = new Vector3(0, 0, 0)
	private UpdateContext(block: Block, x: number, y: number, z: number) {
		const pos = this._adjustableUpdateContext.set(x, y, z)
		//this.BlockContext.CurrentAlpha = this.GetTransparency(block, position)
		this.BlockContext.AnimationStart = this.AnimationStartFor(pos)
		this.BlockContext.Block = block
		this.BlockContext.BlockType = Blocks.TypeOf(block)
		this.BlockContext.Position.set(x, y, z)
		this.BlockContext.TopBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.TopRightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopRightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.RightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.RightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomRightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomRightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomLeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomLeftTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.LeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.LeftTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.TopLeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopLeftTile)) ?? Blocks.NewEmpty(0)
	}

	private AnimationStartFor(position: Vector3) {
		let x = position.x
		let y = position.y
		let z = position.z
		if (x == 0)
			x = 1234
		if (y == 0)
			y = 1234
		if (z == 0)
			z = 1234
		const number = (x / 13 + y / 31 + z / 71) * 345
		return Math.floor(10000 * (number - Math.floor(number)))
	}
}
