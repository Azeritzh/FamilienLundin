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

	containsPoint(x: number, y: number, z: number) {
		return this.minX <= x && x < this.maxX
			&& this.minY <= y && y < this.maxY
			&& this.minZ <= z && z < this.maxZ
	}

	contains(point: Vector3) {
		return this.minX <= point.x && point.x < this.maxX
			&& this.minY <= point.y && point.y < this.maxY
			&& this.minZ <= point.z && point.z < this.maxZ
	}

	/// <summary>
	/// This is like 5%3 -> 2, but instead 5 is a box and 3 and 2 are vectors.
	/// </summary>
	public Contain(position: Vector3) {
		let x = position.x
		if (x < this.minX)
			x += (this.maxX - this.minX)
		else if (x >= this.maxX)
			x -= (this.maxX - this.minX)
		let y = position.y
		if (y < this.minY)
			y += this.maxY - this.minY
		else if (y >= this.maxY)
			y -= (this.maxY - this.minY)
		let z = position.z
		if (z < this.minZ)
			z += this.maxZ - this.minZ
		else if (z >= this.maxZ)
			z -= (this.maxZ - this.minZ)
		return new Vector3(x, y, z)
	}
}