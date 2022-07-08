import { Vector3 } from "@lundin/utility"
import { CircularSize } from "./circular-size"

export class Box { // struct
	constructor(
		public readonly minX: number,
		public readonly maxX: number,
		public readonly minY: number,
		public readonly maxY: number,
		public readonly minZ: number,
		public readonly maxZ: number,
	) { }

	static from(point: Vector3) {
		return new Box(
			point.x,
			point.x,
			point.y,
			point.y,
			point.z,
			point.z,
		)
	}

	translateBy(translation: Vector3) {
		return new Box(
			this.minX + translation.x,
			this.maxX + translation.x,
			this.minY + translation.y,
			this.maxY + translation.y,
			this.minZ + translation.z,
			this.maxZ + translation.z,
		)
	}

	static occupiedArea(point: Vector3, size: CircularSize) {
		return new Box(
			point.x - size.radius,
			point.x + size.radius,
			point.y - size.radius,
			point.y + size.radius,
			point.z,
			point.z + size.height,
		)
	}

	contains(point: Vector3) {
		return this.minX <= point.x && point.x <= this.maxX
			&& this.minY <= point.y && point.y <= this.maxY
			&& this.minZ <= point.z && point.z <= this.maxZ
	}
}