import { Id, typeOf } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Renderend } from "../renderend"
import { DisplayEntity, DisplayState } from "./display-state"
import { SpriteDrawer } from "./sprite-drawer"

export class DisplayEntityDrawer {
	constructor(
		private game: Renderend,
		private state: DisplayState,
		private spriteDrawer: SpriteDrawer,
	) { }

	drawDisplayEntities() {
		for (const entity of this.state.displayEntities.values())
			this.drawDisplayEntity(entity)
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		if (entity.lastUpdate !== this.game.state.globals.tick && entity.velocity)
			entity.position = entity.position.add(entity.velocity)
		entity.lastUpdate = this.game.state.globals.tick
		if (this.game.state.globals.tick < entity.endTick)
			this.spriteDrawer.draw(entity.sprite, entity.position, null, entity.animationStart)
		else
			this.state.displayEntities.remove(entity)
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.typeFor(typeOf(entity))
		switch (type) {
			case "bullet": return this.spawnBulletExplosion(entity)
			case "obstacle": return this.spawnObstacleExplosion(entity)
			case "big-obstacle": return this.spawnBigObstacleExplosion(entity)
		}
	}

	private spawnObstacleExplosion(entity: Id) {
		this.spawnExplosion(
			"obstacle-explosion",
			this.game.entities.position.get.of(entity),
			this.game.entities.velocity.get.of(entity),
			40,
		)
	}

	private spawnBigObstacleExplosion(entity: Id) {
		this.spawnExplosion(
			"big-obstacle-explosion",
			this.game.entities.position.get.of(entity),
			this.game.entities.velocity.get.of(entity),
			40,
		)
	}

	private spawnBulletExplosion(entity: Id) {
		this.spawnExplosion(
			"bullet-explosion",
			this.game.entities.position.get.of(entity),
			new Vector2(-this.game.state.globals.speed, 0),
			20,
		)
	}

	private spawnExplosion(sprite: string, position: Vector2, velocity: Vector2, timeToLive: number) {
		this.state.displayEntities.push({
			sprite,
			position,
			velocity: this.game.state.globals.isAlive ? velocity : null,
			endTick: this.game.state.globals.tick + timeToLive,
			animationStart: this.game.state.globals.tick,
			lastUpdate: this.game.state.globals.tick,
		})
	}
}
