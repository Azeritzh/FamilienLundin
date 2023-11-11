import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { ToolState } from "../../values/tool-state"
import { EntitySprites } from "../state/entity-sprites"

export class EntityContext {
	public Entity: Id
	public EntitySprites = new EntitySprites([])
	public Orientation = 0
	public Position = new Vector3(0, 0, 0)
	public Velocity = new Vector3(0, 0, 0)
	public ToolState: ToolState = null
	public HasShadow = true
}
