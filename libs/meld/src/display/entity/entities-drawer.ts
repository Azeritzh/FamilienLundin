import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DisplayArea } from "../services/camera"
import { DisplayState } from "../state/display-state"

export class EntitiesDrawer {
	constructor(
		private Game: Meld,
		private State: DisplayState,
		private EntityDrawers: EntityDrawer[],
	) { }

	Draw() {
		for (const { layer, area } of this.State.ShownLayers)
			for (const entity of this.entitiesInArea(layer, area))
				for (const drawer of this.EntityDrawers)
					drawer.Draw(entity)
	}

	private entitiesInArea(layer: number, area: DisplayArea) {
		return [...this.Game.Entities.With.Position]
			.filter(([, position]) => this.isInArea(layer, area, position))
			.map(x => x[0])
	}

	private isInArea(layer: number, area: DisplayArea, position: Vector3) {
		return area.Left <= position.x && position.x < area.Right
			&& area.Top <= position.y && position.y < area.Bottom
			&& Math.floor(position.z) == layer
	}
}

export interface EntityDrawer {
	Draw(entity: Id): void
}
