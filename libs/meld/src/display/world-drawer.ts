import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Camera, DisplayArea } from "./camera"
import { DisplayConfig } from "./display-config"
import { TerrainDrawer } from "./terrain-drawer"

export class WorldDrawer {
	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
		private TerrainDrawer: TerrainDrawer,
		private EntityDrawers: EntityDrawer[],
	) { }

	DrawWorld() {
		for (const { layer, area } of this.Camera.ShownLayers)
			this.drawLayer(layer, area)
	}

	private _adjustable = new Vector3(0, 0, 0)
	private drawLayer(layer: number, area: DisplayArea) {
		const entitiesInLayer = this.entitiesInArea(layer, area)
		const startY = Math.floor(area.top - this.Config.WallDisplayHeight)
		const endY = Math.floor(area.bottom + this.Config.WallDisplayHeight)

		for (let y = startY; y <= endY; y++)
			for (let x = Math.floor(area.left); x <= Math.floor(area.right); x++)
				if (this.Camera.IsWithinScreen(this._adjustable.set(x, y, layer)))
					this.TerrainDrawer.DrawBlockContent(x, y, layer)
		for (const entity of entitiesInLayer)
			for (const drawer of this.EntityDrawers)
				drawer.Draw(entity)
	}

	private entitiesInArea(layer: number, area: DisplayArea) {
		return [...this.Game.Entities.With.Position]
			.filter(([, position]) => this.isInArea(layer, area, position))
			.map(x => x[0])
	}

	private isInArea(layer: number, area: DisplayArea, position: Vector3) {
		return area.left <= position.x && position.x < area.right
			&& area.top <= position.y && position.y < area.bottom
			&& Math.floor(position.z) == layer
	}
}

export interface EntityDrawer {
	Draw(entity: Id): void
}
