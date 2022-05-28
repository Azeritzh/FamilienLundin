import { Vector3 } from "@lundin/utility"

export class RenderendConstants {
	constructor(
		public chunkSize: Vector3 = { x: 1, y: 1, z: 1 },
	) { }
}