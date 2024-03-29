import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { EntityContext } from "./entity-context"

export class EntityShadowDrawer {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }

	Draw(context: EntityContext) {
		if (!context.HasShadow)
			return
		this.EntityContext = context
		const height = this.GetFloorHeight(context.Position)
		if (height !== null && height !== undefined)
			this.Camera.DrawAnimated(this.GetShadow(), Layer.Middle - Layer.ZFightingAdjustment, context.Position.withZ(height), context.Velocity)
	}

	private GetFloorHeight(position: Vector3) {
		const nextPosition = Vector3.copy(position)
		let nextBlock = this.Game.Terrain.GetAt(position)
		while (Blocks.TypeOf(nextBlock) === BlockType.Empty) {
			nextPosition.z = nextPosition.z - 1
			nextBlock = this.Game.Terrain.GetAt(nextPosition)
			if (nextPosition.z < position.z - 10)
				return null
		}
		return Camera.HeightOf(Blocks.TypeOf(nextBlock)).z + Math.floor(nextPosition.z) + Layer.ZFightingAdjustment
	}

	private GetShadow() {
		const size = this.Game.Entities.CircularSize.Get.Of(this.EntityContext.Entity)
		if (!size)
			return this.Config.GameplaySprites.Shadow.Small
		return size.Radius < 1
			? this.Config.GameplaySprites.Shadow.Medium
			: this.Config.GameplaySprites.Shadow.Big
	}
}
