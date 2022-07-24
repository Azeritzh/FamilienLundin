import { EntityTypeOf, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"

export class StandardEntityDrawer {
	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }

	Draw(entity: Id) {
		//if (EntityTypeOf(entity) === this.Game.Config.Constants.PlayerType)
		//	this.drawPlayer(entity)
		//else
		this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.Game.Entities.Position.Get.Of(entity)
		const velocity = this.Game.Entities.Velocity.Get.Of(entity)
		const sprite = this.Game.Config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
		this.DrawShadow(entity, position, velocity)
	}

	private DrawShadow(entity: Id, position: Vector3, velocity?: Vector3) { // TODO: it seems to draw shadows too low at full blocks
		const height = this.GetFloorHeight(position)
		if (height !== null && height !== undefined)
			this.Camera.DrawAnimated(this.GetShadowOf(entity), Layer.Middle, position.withZ(height), velocity)
	}

	private GetFloorHeight(position: Vector3) {
		const nextPosition = Vector3.copy(position)
		let nextBlock = this.Game.Terrain.GetAt(position) ?? Blocks.NewFull(0)
		while (Blocks.TypeOf(nextBlock) === BlockType.Empty) {
			nextPosition.z = nextPosition.z - 1
			nextBlock = this.Game.Terrain.GetAt(nextPosition) ?? Blocks.NewFull(0)
			if (nextPosition.z < position.z - 10)
				return null
		}
		return Camera.HeightOf(Blocks.TypeOf(nextBlock)).z + Math.floor(nextPosition.z) + Layer.ZFightingAdjustment
	}

	private GetShadowOf(entity: Id) {
		const size = this.Game.Entities.CircularSize.Get.Of(entity)
		if (!size)
			return this.Config.GameplaySprites.ShadowSmall
		return size.radius < 1
			? this.Config.GameplaySprites.ShadowMedium
			: this.Config.GameplaySprites.ShadowBig
	}

	private drawPlayer(entity: Id) {
		const position = this.Game.Entities.Position.Get.Of(entity)
		const velocity = this.Game.Entities.Velocity.Get.Of(entity)
		const sprite = this.Game.Config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
	}
}