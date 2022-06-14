import { Vector3 } from "@lundin/utility"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class TerrainManager<Block, BlockValues> {
	constructor(
		private config: BaseConfig<BlockValues, any, any>,
		private state: BaseState<any, any, any>,
		private changes: BaseChanges<any, Block>,
	) { }

	public getFromPosition(position: Vector3) {
		return this.get(position.x, position.y, position.z)
	}

	public get(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		const chunk = this.state.chunks.get(this.getChunkCoords(x, y, z))
		return chunk?.get(x, y, z)
		// ?? this.defaultBlock
	}

	public getCurrent(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		return this.changes.updatedBlocks.get({ x, y, z })
			?? this.get(x, y, z)
	}

	private getChunkCoords(x: number, y: number, z: number): Vector3 {
		return {
			x: this.chunkCoord(x, this.config.chunkSize.x),
			y: this.chunkCoord(y, this.config.chunkSize.y),
			z: this.chunkCoord(z, this.config.chunkSize.z),
		}
	}

	private chunkCoord(n: number, size: number) {
		return Math.floor(n / size)
	}

	public set(x: number, y: number, z = 0, block: Block) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		this.changes.updatedBlocks.set({ x, y, z }, block)
	}

	public applyUpdatedValues() {
		for (const [{ x, y, z }, block] of this.changes.updatedBlocks)
			this.setBlock(x, y, z, block)
		this.changes.updatedBlocks.clear()
	}

	private setBlock(x: number, y: number, z: number, block: Block) {
		const chunk = this.state.chunks.get(this.getChunkCoords(x, y, z))
		if (chunk)
			chunk.set(x, y, z, block)
		else
			console.error("Can't set block outside chunks at ({0}, {1}, {2})", x, y, z)
	}
}
