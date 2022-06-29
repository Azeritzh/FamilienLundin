import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Block } from "../state/block"
import { Camera } from "./camera"

export class TerrainDrawer {
	constructor(
		private game: Meld,
		private camera: Camera,
	) { }

	drawBlocks() {
		for (const { position, field } of this.game.terrain.allFields())
			this.drawBlock(position, field)
	}


	private drawBlock(position: Vector3, block: Block) {
		if (position.z !== 0)
			return
		const sprite = this.game.config.blockTypeMap.typeFor(block.solidType) ?? "obstacle"
		this.camera.draw(sprite, position)
	}
}
