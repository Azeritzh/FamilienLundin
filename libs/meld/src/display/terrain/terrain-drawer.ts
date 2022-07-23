import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Block, Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { BlockContext } from "./block-context"
import { BlockDrawer } from "./block-drawer"

export class TerrainDrawer {
	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static NoHeight = new Vector3(0, 0, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 32) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1)

	// pre-allocated vectors:
	private Position = new Vector3(0, 0, 0)
	private TopPosition = new Vector3(0, 0, 0)
	private TopRightPosition = new Vector3(0, 0, 0)
	private RightPosition = new Vector3(0, 0, 0)
	private BottomRightPosition = new Vector3(0, 0, 0)
	private BottomPosition = new Vector3(0, 0, 0)
	private BottomLeftPosition = new Vector3(0, 0, 0)
	private LeftPosition = new Vector3(0, 0, 0)
	private TopLeftPosition = new Vector3(0, 0, 0)
	private Below = new Vector3(0, 0, -1)
	private Adjustable = new Vector3(0, 0, 0)

	private BlockContext = new BlockContext()

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
		this.UpdateContext(block, this.Position)
		for (const drawer of this.BlockDrawers)
			drawer.Draw(this.BlockContext)

		this.updateDirections()
		this.DrawWallShadows(block, this.Position)
	}

	private _adjustableUpdateContext = new Vector3(0, 0, 0)
	private UpdateContext(block: Block, position: Vector3) {
		const pos = this._adjustableUpdateContext
		//this.BlockContext.CurrentAlpha = this.GetTransparency(block, position)
		this.BlockContext.AnimationStart = this.AnimationStartFor(position)
		this.BlockContext.Block = block
		this.BlockContext.BlockType = Blocks.TypeOf(block)
		this.BlockContext.Position.setFrom(position)
		this.BlockContext.TopBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.TopTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.TopRightBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.TopRightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.RightBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.RightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomRightBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomRightTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.BottomLeftBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomLeftTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.LeftBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.LeftTile)) ?? Blocks.NewEmpty(0)
		this.BlockContext.TopLeftBlock = this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(this.Camera.TopLeftTile)) ?? Blocks.NewEmpty(0)
	}

	private updateDirections() {
		this.TopPosition.setFrom(this.Position).addFrom(this.Camera.TopTile)
		this.TopRightPosition.setFrom(this.Position).addFrom(this.Camera.TopRightTile)
		this.RightPosition.setFrom(this.Position).addFrom(this.Camera.RightTile)
		this.BottomRightPosition.setFrom(this.Position).addFrom(this.Camera.BottomRightTile)
		this.BottomPosition.setFrom(this.Position).addFrom(this.Camera.BottomTile)
		this.BottomLeftPosition.setFrom(this.Position).addFrom(this.Camera.BottomLeftTile)
		this.LeftPosition.setFrom(this.Position).addFrom(this.Camera.LeftTile)
		this.TopLeftPosition.setFrom(this.Position).addFrom(this.Camera.TopLeftTile)
	}

	private DrawWallShadows(leftBlock: Block, leftPosition: Vector3) {
		const rightBlock = this.Game.Terrain.GetAt(this.RightPosition)
		if (!rightBlock)
			return

		if (Blocks.TypeOf(leftBlock) === BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(this.RightPosition).addFrom(this.Below))) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Bottom + Layer.OverlayWestAdjustment, this.getCenter(leftPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Floor + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Middle + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Half) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(this.RightPosition).addFrom(this.Below))) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Bottom + Layer.OverlayWestAdjustment, this.getCenter(leftPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Floor + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Middle + Layer.OverlayEastAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Floor) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Floor + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Floor + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition).addFrom(TerrainDrawer.FloorHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(leftPosition).addFrom(this.Below))) === BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Bottom + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Bottom + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition))
		}
	}

	private getCenter(position: Vector3) {
		return this.Adjustable.setFrom(position).addFrom(TerrainDrawer.BlockCenter)
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
