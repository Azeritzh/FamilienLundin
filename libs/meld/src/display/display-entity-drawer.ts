import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Camera, Layer } from "./camera"
import { DisplayConfig, DurationOf } from "./display-config"
import { DisplayState } from "./display-state"

export class DisplayEntityDrawer {
	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
		private UpdatedToTick = Game.State.Globals.Tick
	) { }

	DrawDisplayEntities() {
		this.UpdateDisplayEntities()
		for (const entity of this.State.DisplayEntities.values())
			this.DrawDisplayEntity(entity)
	}

	private UpdateDisplayEntities() {
		while (this.UpdatedToTick < this.Game.State.Globals.Tick) {
			this.UpdatedToTick++
			for (const entity of this.State.DisplayEntities.values())
				this.UpdateDisplayEntity(entity)
		}
	}

	private UpdateDisplayEntity(entity: DisplayEntity) {
		entity.Position.addFrom(entity.Velocity)
		if (entity.EndTick <= this.Game.State.Globals.Tick)
			this.State.DisplayEntities.remove(entity)
	}

	private DrawDisplayEntity(entity: DisplayEntity) {
		if (entity.ParentEntity) {
			const position = this.Game.Entities.Position.Get.Of(entity.ParentEntity) ?? new Vector3(0, 0, 0)
			const velocity = this.Game.Entities.Velocity.Get.Of(entity.ParentEntity) ?? new Vector3(0, 0, 0)
			this.Camera.DrawAnimated(entity.Sprite, Layer.Middle, position.add(entity.Position), velocity.add(entity.Velocity), entity.AnimationStart, entity.Rotation)
		}
		else {
			this.Camera.DrawAnimated(entity.Sprite, Layer.Middle, entity.Position, entity.Velocity, entity.AnimationStart, entity.Rotation)
		}
	}

	Add(sprite: string, position: Vector3, velocity: Vector3, rotation = 0) {
		const info = this.Config.Sprites[sprite]
		this.State.DisplayEntities.push({
			Sprite: sprite,
			Position: position,
			Velocity: velocity,
			EndTick: this.Game.State.Globals.Tick + DurationOf(info),
			AnimationStart: this.Game.State.Globals.Tick,
			LastUpdate: this.Game.State.Globals.Tick,
			Rotation: rotation
		})
	}

	AddRelative(sprite: string, entity: Id, position: Vector3 = null, velocity: Vector3 = null, rotation = 0) {
		const info = this.Config.Sprites[sprite]
		this.State.DisplayEntities.push({
			Sprite: sprite,
			ParentEntity: entity,
			Position: position ?? new Vector3(0, 0, 0),
			Velocity: velocity ?? new Vector3(0, 0, 0),
			EndTick: this.Game.State.Globals.Tick + DurationOf(info),
			AnimationStart: this.Game.State.Globals.Tick,
			LastUpdate: this.Game.State.Globals.Tick,
			Rotation: rotation,
		})
	}
}

export interface DisplayEntity {
	Sprite: string
	ParentEntity?: Id
	Position: Vector3
	Velocity: Vector3
	EndTick: number
	AnimationStart: number
	LastUpdate: number
	Rotation: number
}
