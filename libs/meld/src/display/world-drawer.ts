import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Camera, DisplayArea } from "./camera"
import { DisplayConfig } from "./display-config"
import { EntityDrawer } from "./entity-drawer"
import { TerrainDrawer } from "./terrain-drawer"

export class WorldDrawer {
	constructor(
		private game: Meld,
		private config: DisplayConfig,
		private camera: Camera,
		private terrainDrawer: TerrainDrawer,
		private entityDrawer: EntityDrawer,
	) { }

	drawWorld() {
		for (const { layer, area } of this.camera.shownLayers)
			this.drawLayer(layer, area)
	}

	private drawLayer(layer: number, area: DisplayArea) {
		const entitiesInLayer = this.entitiesInArea(layer, area)
		const startY = Math.floor(area.top - this.config.wallDisplayHeight)
		const endY = Math.floor(area.bottom + this.config.wallDisplayHeight)

		for (let y = startY; y <= endY; y++)
			for (let x = Math.floor(area.left - 1); x <= Math.floor(area.right + 1); x++)
				this.terrainDrawer.drawBlockContent(x, y, layer)
		for (const entity of entitiesInLayer)
			this.entityDrawer.draw(entity)
	}

	private entitiesInArea(layer: number, area: DisplayArea) {
		return [...this.game.entities.with.position]
			.filter(([, position]) => this.isInArea(layer, area, position))
			.map(x => x[0])
	}

	private isInArea(layer: number, area: DisplayArea, position: Vector3) {
		return area.left <= position.x && position.x < area.right
			&& area.top <= position.y && position.y < area.bottom
			&& Math.floor(position.z) == layer
	}
}
