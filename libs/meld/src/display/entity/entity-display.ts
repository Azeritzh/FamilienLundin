import { Box, EntityTypeOf, Id } from "@lundin/age"
import { Rotate, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DisplayArea } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { AngleFromNorth, DisplayState } from "../state/display-state"
import { EntitySprites } from "../state/entity-sprites"
import { EntityContext } from "./entity-context"

export class EntityDisplay {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private EntityDrawers: EntityDrawer[],
	) { }

	Draw() {
		for (const entity of this.VisibleEntities())
			this.DrawEntity(entity)
		for (const entity of this.VisibleBlockEntities())
			this.DrawBlockEntity(entity)
	}

	private *VisibleEntities() {
		const box = this.VisibleAreaBox()
		const entities = [...this.Game.Entities.With.Position]
			.filter(x => box.Contains(x[1]))
		for (const { layer, area } of this.State.ShownLayers)
			for (const entity of entities.filter(x => this.IsInArea(layer, area, x[1])))
				yield entity[0]
	}

	private *VisibleBlockEntities() {
		const box = this.VisibleAreaBox()
		const entities = [...this.Game.Entities.With.BlockPosition]
			.filter(x => box.Contains(x[1]))
		for (const { layer, area } of this.State.ShownLayers)
			for (const entity of entities.filter(x => this.IsInArea(layer, area, x[1])))
				yield entity[0]
	}

	private VisibleAreaBox() {
		const State = this.State
		if (State.ShownLayers.length === 0)
			return new Box(0, 0, 0, 0, 0, 0)
		return new Box(
			State.ShownLayers.map(x => x.area.Left).min(),
			State.ShownLayers.map(x => x.area.Right).max(),
			State.ShownLayers.map(x => x.area.Top).min(),
			State.ShownLayers.map(x => x.area.Bottom).max(),
			State.ShownLayers.map(x => x.layer).min(),
			State.ShownLayers.map(x => x.layer).max()
		)
	}

	private IsInArea(layer: number, area: DisplayArea, position: Vector3) {
		return area.Left <= position.x && position.x < area.Right
			&& area.Top <= position.y && position.y < area.Bottom
			&& Math.floor(position.z) == layer
	}

	private DrawEntity(entity: Id) {
		if (!this.Config.EntitySprites.has(EntityTypeOf(entity)))
			return
		this.UpdateEntityContext(entity, this.Config.EntitySprites.get(EntityTypeOf(entity))!)
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
		this.EntityContext.ToolState = this.Game.Entities.ToolState.Get.Of(entity) ?? null // translate from undefined to null
	}

	private DrawBlockEntity(entity: Id) {
		if (!this.Config.EntitySprites.has(EntityTypeOf(entity)))
			return
		this.UpdateBlockEntityContext(entity, this.Config.EntitySprites.get(EntityTypeOf(entity))!)
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
		this.EntityContext.HasShadow = false
	}
}

export interface EntityDrawer {
	Draw(context: EntityContext): void
}
