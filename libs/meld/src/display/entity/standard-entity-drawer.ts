import { EntityTypeOf, Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { SpriteFor } from "../state/entity-sprites"
import { EntityContext } from "./entity-context"

export class StandardEntityDrawer {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }

	Draw(context: EntityContext) {
		this.EntityContext = context
		//if (EntityTypeOf(entity) === this.Game.Config.Constants.PlayerType)
		//	this.drawPlayer(entity)
		//else
		this.drawGeneralEntity(context.Entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.Game.Entities.Position.Get.Of(entity)
		const velocity = this.Game.Entities.Velocity.Get.Of(entity)
		const orientation = this.Game.Entities.Orientation.Get.Of(entity) ?? 0
		const sprite = SpriteFor(this.Config.EntitySprites.get(EntityTypeOf(entity)).Rotations, orientation)
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
		this.DrawShadow(entity, position, velocity)
	}

	private DrawShadow(entity: Id, position: Vector3, velocity?: Vector3) {
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
