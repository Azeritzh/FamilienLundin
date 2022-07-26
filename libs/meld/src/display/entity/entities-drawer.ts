import { EntityTypeOf, Id } from "@lundin/age"
import { Rotate, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DisplayArea } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { AngleOf, DisplayState } from "../state/display-state"
import { EntitySprites } from "../state/entity-sprites"
import { EntityContext } from "./entity-context"

export class EntitiesDrawer {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private EntityDrawers: EntityDrawer[],
	) { }

	Draw() {
		for (const { layer, area } of this.State.ShownLayers)
			for (const entity of this.entitiesInArea(layer, area))
				this.DrawEntity(entity)
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

	private DrawEntity(entity: Id) {
		if (!this.Config.EntitySprites.has(EntityTypeOf(entity)))
			return
		this.UpdateEntityContext(entity, this.Config.EntitySprites.get(EntityTypeOf(entity)))
		for (const drawer of this.EntityDrawers)
			drawer.Draw(this.EntityContext)
	}

	private UpdateEntityContext(entity: Id, entitySprites: EntitySprites) {
		this.EntityContext.Entity = entity
		this.EntityContext.EntitySprites = entitySprites
		const orientation = this.Game.Entities.Orientation.Get.Of(entity) ?? 0
		this.EntityContext.Orientation = Rotate(orientation, AngleOf(-this.State.ViewDirection))
		this.EntityContext.Position = this.Game.Entities.Position.Get.Of(entity) ?? new Vector3(0, 0, 0)
		this.EntityContext.Velocity = this.Game.Entities.Velocity.Get.Of(entity) ?? new Vector3(0, 0, 0)
		//this.EntityContext.ToolState = this.Game.Entities.ToolState.Get.Of(entity)
	}
}

export interface EntityDrawer {
	Draw(context: EntityContext): void
}
