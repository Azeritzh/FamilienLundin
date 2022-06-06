import { Vector3 } from "@lundin/utility"

export class EntitySize { // struct
	constructor(
		public readonly height: number,
		public readonly radius: number,
	) { }
}

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
			point.z)
	}

	translateBy(translation: Vector3) {
		return new Box(
			this.minX + translation.x,
			this.maxX + translation.x,
			this.minY + translation.y,
			this.maxY + translation.y,
			this.minZ + translation.z,
			this.maxZ + translation.z)
	}
}