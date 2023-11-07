import { EntityTypeOf, Id } from "@lundin/age"
import { Rotate, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DisplayArea } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { AngleFromNorth, DisplayState } from "../state/display-state"
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
		for (const { layer, area } of this.State.ShownLayers) {
			for (const entity of this.EntitiesInArea(layer, area))
				this.DrawEntity(entity)
			for (const entity of this.BlockEntitiesInArea(layer, area))
				this.DrawBlockEntity(entity)
		}
	}

	private EntitiesInArea(layer: number, area: DisplayArea) {
		return [...this.Game.Entities.With.Position]
			.filter(([, position]) => this.IsInArea(layer, area, position))
			.map(x => x[0])
	}

	private IsInArea(layer: number, area: DisplayArea, position: Vector3) {
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
		this.EntityContext.Orientation = Rotate(orientation, -AngleFromNorth(this.State.ViewDirection))
		this.EntityContext.Position = this.Game.Entities.Position.Get.Of(entity) ?? Vector3.Zero
		this.EntityContext.Velocity = this.Game.Entities.Velocity.Get.Of(entity) ?? Vector3.Zero
		this.EntityContext.ToolState = this.Game.Entities.ToolState.Get.Of(entity)
	}
	
	private BlockEntitiesInArea(layer: number, area: DisplayArea) {
		return [...this.Game.Entities.With.BlockPosition]
			.filter(([, position]) => this.IsInArea(layer, area, position))
			.map(x => x[0])
	}

	private DrawBlockEntity(entity: Id) {
		if (!this.Config.EntitySprites.has(EntityTypeOf(entity)))
			return
		this.UpdateBlockEntityContext(entity, this.Config.EntitySprites.get(EntityTypeOf(entity)))
		for (const drawer of this.EntityDrawers)
			drawer.Draw(this.EntityContext)
	}

	private UpdateBlockEntityContext(entity: Id, entitySprites: EntitySprites) {
		this.EntityContext.Entity = entity
		this.EntityContext.EntitySprites = entitySprites
		this.EntityContext.Orientation = 0
		this.EntityContext.Position = this.Game.Entities.BlockPosition.Get.Of(entity) ?? Vector3.Zero
		this.EntityContext.Velocity = Vector3.Zero
		this.EntityContext.ToolState = null
	}
}

export interface EntityDrawer {
	Draw(context: EntityContext): void
}
