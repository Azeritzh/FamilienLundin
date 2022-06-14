import { Vector3 } from "@lundin/utility"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class TerrainManager<BlockValues> {
	constructor(
		private config: BaseConfig<BlockValues, any, any>,
		private state: BaseState<any, any, any>,
		private changes: BaseChanges<any>,
	) { }

	getFromPosition(position: Vector3) {
		return this.get(position.x, position.y, position.z)
	}

	get(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		const chunk = this.state.chunks.get(this.getChunkCoords(x,y,z))
		if (chunk)
			return chunk.get(x, y, z) // TODO: changes
		// return this.defaultBlock
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

	// TODO: set
}
