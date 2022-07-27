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
		this.BlockContext.CurrentAlpha = this.GetTransparency(block, pos)
		this.BlockContext.AnimationStart = this.AnimationStartFor(pos)
		this.BlockContext.Block = block
		this.BlockContext.BlockType = Blocks.TypeOf(block)
		this.BlockContext.Position.set(x, y, z)
		this.BlockContext.TopBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopTile))
		this.BlockContext.TopRightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopRightTile))
		this.BlockContext.RightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.RightTile))
		this.BlockContext.BottomRightBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomRightTile))
		this.BlockContext.BottomBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomTile))
		this.BlockContext.BottomLeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.BottomLeftTile))
		this.BlockContext.LeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.LeftTile))
		this.BlockContext.TopLeftBlock = this.Game.Terrain.GetAt(pos.set(x, y, z).addFrom(this.Camera.TopLeftTile))
	}

	private GetTransparency(block: Block, position: Vector3) {
		const layerDifference = Math.floor(position.z) - Math.floor(this.State.FocusPoint.z)
		if (layerDifference == 0)
			return this.ShouldBeTransparentAtPlayerLayer(block, position) ? this.Config.TransparencyAlpha : 1
		return 1
	}

	private _adjustableShouldBeTransparentAtPlayerLayer = new Vector3(0, 0, 0)
	private ShouldBeTransparentAtPlayerLayer(block: Block, position: Vector3) {
		const pos = this._adjustableShouldBeTransparentAtPlayerLayer
		const blockType = Blocks.TypeOf(block)
		if (blockType == BlockType.Empty || blockType == BlockType.Floor)
			return false
		if (pos.setFrom(position).subtractFrom(this.State.FocusPoint).lengthSquared() > this.Config.TransparencyRadius * this.Config.TransparencyRadius)
			return false

		if (this.Camera.IsDiagonalView())
			return this.DiagonalShouldBeTransparent(blockType, position)
		return this.StraightShouldBeTransparent(blockType, position)
	}

	private DiagonalShouldBeTransparent(blockType: BlockType, position: Vector3) {
		if (this.IsInQuadrant(position, this.Camera.LeftTile))
			return this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopTile)
				&& this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopRightTile)
		if (this.IsInQuadrant(position, this.Camera.RightTile))
			return this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopTile)
				&& this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopLeftTile)
		if (this.IsInQuadrant(position, this.Camera.BottomTile))
			return this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopTile)
		return false
	}

	private _adjustableShouldBeTransparentDueToDirection = new Vector3(0, 0, 0)
	private ShouldBeTransparentDueToDirection(blockType: BlockType, position: Vector3, direction: Vector3) {
		const pos = this._adjustableShouldBeTransparentDueToDirection
		if (!this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(direction)))
			return false

		const topBlockType = Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(direction)))
		if (blockType == BlockType.Half || this.Camera.IsDiagonalView())
			return topBlockType < blockType
		const topTopBlockType = Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(direction).addFrom(direction)))
		return (topBlockType < blockType || topTopBlockType < blockType)
	}

	private StraightShouldBeTransparent(blockType: BlockType, position: Vector3) {
		return this.IsInBottomHalf(position) && this.ShouldBeTransparentDueToDirection(blockType, position, this.Camera.TopTile)
	}

	private _adjustableIsInBottomHalf = new Vector3(0, 0, 0)
	private IsInBottomHalf(position: Vector3) {
		const relativePosition = this._adjustableIsInBottomHalf.setFrom(position).subtract(this.State.FocusPoint)
		const tempX = relativePosition.x * this.Camera.BottomTile.x
		const tempY = relativePosition.y * this.Camera.BottomTile.y
		return tempX >= 0 && tempY >= 0
	}

	private _adjustableIsInQuadrant = new Vector3(0, 0, 0)
	private IsInQuadrant(position: Vector3, quadrant: Vector3) {
		const relativePosition = this._adjustableIsInQuadrant.setFrom(position).subtract(this.State.FocusPoint)
		relativePosition.x += 1
		const tempX = relativePosition.x * quadrant.x
		const tempY = relativePosition.y * quadrant.y
		return tempX > 0 && tempY > 0
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
