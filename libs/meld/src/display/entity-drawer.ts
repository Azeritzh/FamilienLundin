import { Id, typeOf } from "@lundin/age"
import { Meld } from "../meld"
import { Camera } from "./camera"

export class EntityDrawer {
	constructor(
		private game: Meld,
		private camera: Camera,
	) { }

	drawEntities() {
		for (const entity of this.game.entities)
			this.drawEntity(entity)
	}

	drawEntity(entity: Id) {
		if (typeOf(entity) === this.game.config.constants.playerType)
			this.drawPlayer(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const sprite = this.game.config.entityTypeMap.typeFor(typeOf(entity))
		this.camera.drawAnimated(sprite, position, velocity)
	}

	private drawPlayer(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		//const sprite = this.game.config.entityTypeMap.typeFor(typeOf(entity))
		const selectedBlock = this.game.entities.selectedBlock.get.of(entity)
		const selectedBlockName = this.game.config.solidTypeMap.typeFor(selectedBlock) + "-tile"
		this.camera.drawAnimated(selectedBlockName, position, velocity)
	}
}
