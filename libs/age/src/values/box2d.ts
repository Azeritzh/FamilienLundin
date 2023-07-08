import { Vector2 } from "@lundin/utility"
import { RectangularSize } from "./rectangular-size"

export class Box2d { // struct
	constructor(
		public readonly minX: number,
		public readonly maxX: number,
		public readonly minY: number,
		public readonly maxY: number,
	) { }

	static from(point: Vector2, size: RectangularSize) {
		return new Box2d(
			point.x - size.Width / 2,
			point.x + size.Width / 2,
			point.y - size.Height / 2,
			point.y + size.Height / 2,
		)
	}

	translateBy(translation: Vector2) {
		return new Box2d(
			this.minX + translation.x,
			this.maxX + translation.x,
			this.minY + translation.y,
			this.maxY + translation.y,
		)
	}

	contains(point: Vector2) {
		return this.minX <= point.x && point.x <= this.maxX && this.minY <= point.y && point.y <= this.maxY
	}
}