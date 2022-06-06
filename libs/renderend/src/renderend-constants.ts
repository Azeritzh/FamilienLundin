import { Vector3 } from "@lundin/utility"

export class RenderendConstants {
	constructor(
		public shipType: string,
		public chunkSize: Vector3 = { x: 1, y: 1, z: 1 },
	) { }
}