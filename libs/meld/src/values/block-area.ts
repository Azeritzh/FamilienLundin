import { Box } from "@lundin/age"
import { GridVector } from "@lundin/utility"

export class BlockArea {
	constructor(
		public MinX = 0,
		public MaxX = 0,
		public MinY = 0,
		public MaxY = 0,
		public HasCollision = false
	) { }

	OccupiedArea(position: GridVector) {
		return new Box(
			position.X + this.MinX,
			position.X + this.MaxX,
			position.Y + this.MinY,
			position.Y + this.MaxY,
			position.Z,
			position.Z + 1)
	}
}
