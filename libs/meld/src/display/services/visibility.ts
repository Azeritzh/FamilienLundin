import { BlockChunk } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Blocks, BlockType } from "../../state/block"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { Camera, DisplayArea } from "./camera"

export class Visibility {
	public static ScreenMargin = 3
	constructor(
		public Game: Meld,
		public Config: DisplayConfig,
		public State: DisplayState,
		public Camera: Camera,
	) { }

	UpdateSize() {
		const topArea = this.DisplayAreaFor(this.Config.DisplayDepth)
		const bottomArea = this.DisplayAreaFor(-this.Config.DisplayDepth)

		const maxX = topArea.Right > bottomArea.Right ? topArea.Right : bottomArea.Right
		const minX = topArea.Left < bottomArea.Left ? topArea.Left : bottomArea.Left
		const sizeX = maxX - minX + 6 // extra margin to guard against wobbly-ness of ShownLayers

		const maxY = topArea.Bottom > bottomArea.Bottom ? topArea.Bottom : bottomArea.Bottom
		const minY = topArea.Top < bottomArea.Top ? topArea.Top : bottomArea.Top
		const sizeY = maxY - minY + 6 // extra margin to guard against wobbly-ness of ShownLayers

		const sizeZ = this.Config.DisplayDepth * 2 + 2
		this.State.VisibleBlocks = new BlockChunk<boolean>([], new Vector3(Math.floor(sizeX), Math.floor(sizeY), sizeZ))
	}

	Update() {
		this.Reset()
		this.UpdateShownLayers()
		this.FindVisibleBlocks()
	}

	private Reset() {
		for (let x = 0; x < this.State.VisibleBlocks.ChunkSize.x; x++)
			for (let y = 0; y < this.State.VisibleBlocks.ChunkSize.y; y++)
				for (let z = 0; z < this.State.VisibleBlocks.ChunkSize.z; z++)
					this.State.VisibleBlocks.SetWithoutOffset(x, y, z, false)
		this.State.VisibleBlocks.Offset.set(
			Math.floor(this.State.CameraPosition.x - this.State.VisibleBlocks.ChunkSize.x / 2),
			Math.floor(this.State.CameraPosition.y - this.State.VisibleBlocks.ChunkSize.y / 2),
			Math.floor(this.State.CameraPosition.z - this.State.VisibleBlocks.ChunkSize.z / 2)
		)
	}

	private UpdateShownLayers() {
		this.State.ShownLayers.clear()
		for (let layer = -this.Config.DisplayDepth; layer <= this.Config.DisplayDepth; layer++)
			this.State.ShownLayers.push({ layer: layer + Math.floor(this.State.CameraPosition.z), area: this.DisplayAreaFor(layer) })
	}

	private DisplayAreaFor(layer: number) {
		const corners = [
			this.Camera.TilePositionFor(0, 0),
			this.Camera.TilePositionFor(1, 0),
			this.Camera.TilePositionFor(0, 1),
			this.Camera.TilePositionFor(1, 1),
		]
		let top = Number.MAX_VALUE
		let bottom = Number.MIN_VALUE
		let left = Number.MAX_VALUE
		let right = Number.MIN_VALUE
		for (const corner of corners) {
			if (corner.y < top)
				top = corner.y
			if (corner.y > bottom)
				bottom = corner.y
			if (corner.x < left)
				left = corner.x
			if (corner.x > right)
				right = corner.x
		}
		const layerAdjustment = this.Camera.BottomTile.multiply(layer * this.Config.WallDisplayHeight)
		return new DisplayArea(
			top + layerAdjustment.y - Visibility.ScreenMargin,
			bottom + layerAdjustment.y + Visibility.ScreenMargin,
			left + layerAdjustment.x - Visibility.ScreenMargin,
			right + layerAdjustment.x + Visibility.ScreenMargin)
	}

	private FindVisibleBlocks() {
		this.State.PlayerIsBlocked = false
		this.CheckPlayerLayer()
		this.CheckLowerLayers()
		this.CheckUpperLayers()
	}

	private CheckPlayerLayer() {
		const { layer, area } = this.State.ShownLayers[this.Config.DisplayDepth]
		for (let y = Math.floor(area.Top); y <= Math.floor(area.Bottom); y++)
			for (let x = Math.floor(area.Left); x <= Math.floor(area.Right); x++)
				this.CheckAtPlayerLayer(x, y, layer)
	}

	private _adjustableCheckAtPlayerLayer = new Vector3(0, 0, 0)
	private CheckAtPlayerLayer(x: number, y: number, z: number) {
		const position = this._adjustableCheckAtPlayerLayer.set(x, y, z)
		if (!this.Camera.IsWithinScreen(position))
			return
		const blockType = Blocks.TypeOf(this.Game.Terrain.Get(x, y, z)) ?? BlockType.Empty
		if (blockType != BlockType.Full)
			this.State.VisibleBlocks.Set(x, y, z, true)
		if (blockType == BlockType.Full && !this.IsBlocked(position))
			this.State.VisibleBlocks.Set(x, y, z, true)
		if (blockType == BlockType.Empty)
			this.AddToVisibleBelow(position)
	}

	private _adjustableIsBlocked = new Vector3(0, 0, 0)
	private IsBlocked(position: Vector3) {
		const pos = this._adjustableIsBlocked
		const blockAbove = Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(Camera.Above))) ?? BlockType.Empty
		if (blockAbove == BlockType.Empty)
			return false
		return Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(Camera.North))) == BlockType.Full
			&& Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(Camera.East))) == BlockType.Full
			&& Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(Camera.South))) == BlockType.Full
			&& Blocks.TypeOf(this.Game.Terrain.GetAt(pos.setFrom(position).addFrom(Camera.West))) == BlockType.Full
	}

	private _adjustableAddToVisibleBelow = new Vector3(0, 0, 0)
	private AddToVisibleBelow(position: Vector3) {
		const pos = this._adjustableAddToVisibleBelow.setFrom(position)
		const below = pos.addFrom(Camera.Below)
		this.State.VisibleBlocks.SetAt(below, true)
		if (Blocks.TypeOf(this.Game.Terrain.GetAt(below)) == BlockType.Full)
			return
		const depth = Math.ceil(this.Config.WallDisplayHeight)
		for (let i = 1; i <= depth; i++)
			this.State.VisibleBlocks.SetAt(pos.setFrom(this.Camera.TopTile).multiplyFrom(i).addFrom(position).addFrom(Camera.Below), true)
		if (this.Camera.IsDiagonalView()) {
			for (let i = 0; i < depth; i++) {
				this.State.VisibleBlocks.SetAt(pos.setFrom(this.Camera.TopTile).multiplyFrom(i).addFrom(position).addFrom(Camera.Below).addFrom(this.Camera.TopLeftTile), true)
				this.State.VisibleBlocks.SetAt(pos.setFrom(this.Camera.TopTile).multiplyFrom(i).addFrom(position).addFrom(Camera.Below).addFrom(this.Camera.TopRightTile), true)
			}
		}
	}

	private _adjustableCheckLowerLayers = new Vector3(0, 0, 0)
	private CheckLowerLayers() {
		for (let i = this.Config.DisplayDepth - 1; i > 0; i--) {
			const { layer, area } = this.State.ShownLayers[i]
			for (let y = Math.floor(area.Top); y <= Math.floor(area.Bottom); y++)
				for (let x = Math.floor(area.Left); x <= Math.floor(area.Right); x++)
					if (this.State.VisibleBlocks.Get(x, y, layer) && this.Camera.IsWithinScreen(this._adjustableCheckLowerLayers.set(x, y, layer)))
						this.RevealNextLayer(x, y, layer)
		}
	}

	private _adjustableRevealNextLayer = new Vector3(0, 0, 0)
	private RevealNextLayer(x: number, y: number, z: number) {
		const blockType = Blocks.TypeOf(this.Game.Terrain.Get(x, y, z)) ?? BlockType.Empty
		if (blockType == BlockType.Empty)
			this.AddToVisibleBelow(this._adjustableRevealNextLayer.set(x, y, z))
	}

	private CheckUpperLayers() {
		const maxHeight = this.Config.DisplayDepth + this.DistanceToCeiling()
		for (let i = this.Config.DisplayDepth + 1; i <= maxHeight; i++) {
			const { layer, area } = this.State.ShownLayers[i]
			for (let y = Math.floor(area.Top); y <= Math.floor(area.Bottom); y++)
				for (let x = Math.floor(area.Left); x <= Math.floor(area.Right); x++)
					this.DoTheShowShow(x, y, layer, area)
		}
	}

	private _adjustableDistanceToCeiling = new Vector3(0, 0, 0)
	private DistanceToCeiling() {
		for (let i = 1; i <= this.Config.DisplayDepth; i++)
			if (Blocks.TypeOf(this.Game.Terrain.GetAt(this._adjustableDistanceToCeiling.setFrom(Camera.Above).multiplyFrom(i).addFrom(this.State.CameraPosition))) != BlockType.Empty)
				return i - 1
		return this.Config.DisplayDepth
	}

	private _adjustableDoTheShowShow = new Vector3(0, 0, 0)
	private DoTheShowShow(x: number, y: number, z: number, area: DisplayArea) { // mostly the same as CheckAtPlayerLayer, but too lazy to make a proper dry function right now
		const position = this._adjustableDoTheShowShow.set(x, y, z)
		if (!this.Camera.IsWithinScreen(position))
			return
		const blockType = Blocks.TypeOf(this.Game.Terrain.Get(x, y, z)) ?? BlockType.Empty
		if (!this.State.PlayerIsBlocked && blockType != BlockType.Empty)
			this.State.PlayerIsBlocked = this.IsBlockingPlayer(position, area)
		if (blockType != BlockType.Full)
			this.State.VisibleBlocks.Set(x, y, z, true)
		if (blockType == BlockType.Full && !this.IsBlocked(position))
			this.State.VisibleBlocks.Set(x, y, z, true)
	}

	private _adjustableIsBlockingPlayer = new Vector3(0, 0, 0)
	private IsBlockingPlayer(position: Vector3, area: DisplayArea) {
		const middle = new Vector3(
			(area.Left + area.Right - 1) / 2,
			(area.Top + area.Bottom - 1) / 2,
			position.z
		)
		return this._adjustableIsBlockingPlayer.setFrom(position).subtract(middle).lengthSquared() < 1
	}
}
