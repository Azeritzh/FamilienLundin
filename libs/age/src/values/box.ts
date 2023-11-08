import { Contain, Vector3 } from "@lundin/utility"
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

	static FromOffsetAndSize(offset: Vector3, size: Vector3) {
		return new Box(
			offset.X,
			offset.X + size.X,
			offset.Y,
			offset.Y + size.Y,
			offset.Z,
			offset.Z + size.Z,
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
		return new Vector3(
			Contain(position.X, this.MinX, this.MaxX),
			Contain(position.Y, this.MinY, this.MaxY),
			Contain(position.Z, this.MinZ, this.MaxZ)
		)
	}
}