import { Vector3 } from "@lundin/utility"
import { CircularSize } from "./circular-size"

export class Box { // struct
	constructor(
		public readonly MinX: number,
		public readonly MaxX: number,
		public readonly MinY: number,
		public readonly MaxY: number,
		public readonly MinZ: number,
		public readonly MaxZ: number,
	) { }

	static From(point: Vector3) {
		return new Box(
			point.x,
			point.x,
			point.y,
			point.y,
			point.z,
			point.z,
		)
	}

	TranslateBy(translation: Vector3) {
		return new Box(
			this.MinX + translation.x,
			this.MaxX + translation.x,
			this.MinY + translation.y,
			this.MaxY + translation.y,
			this.MinZ + translation.z,
			this.MaxZ + translation.z,
		)
	}

	static OccupiedArea(point: Vector3, size: CircularSize) {
		return new Box(
			point.x - size.Radius,
			point.x + size.Radius,
			point.y - size.Radius,
			point.y + size.Radius,
			point.z,
			point.z + size.Height,
		)
	}

	ContainsPoint(x: number, y: number, z: number) {
		return this.MinX <= x && x < this.MaxX
			&& this.MinY <= y && y < this.MaxY
			&& this.MinZ <= z && z < this.MaxZ
	}

	Contains(point: Vector3) {
		return this.MinX <= point.x && point.x < this.MaxX
			&& this.MinY <= point.y && point.y < this.MaxY
			&& this.MinZ <= point.z && point.z < this.MaxZ
	}

	/// <summary>
	/// This is like 5%3 -> 2, but instead 5 is a box and 3 and 2 are vectors.
	/// </summary>
	public Contain(position: Vector3) {
		let x = position.x
		if (x < this.MinX)
			x += (this.MaxX - this.MinX)
		else if (x >= this.MaxX)
			x -= (this.MaxX - this.MinX)
		let y = position.y
		if (y < this.MinY)
			y += this.MaxY - this.MinY
		else if (y >= this.MaxY)
			y -= (this.MaxY - this.MinY)
		let z = position.z
		if (z < this.MinZ)
			z += this.MaxZ - this.MinZ
		else if (z >= this.MaxZ)
			z -= (this.MaxZ - this.MinZ)
		return new Vector3(x, y, z)
	}
}