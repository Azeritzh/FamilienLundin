import { Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"

export abstract class GameUpdate { }

export class GenerateAction extends GameUpdate { }

export class MovementAction extends GameUpdate {
	constructor(
		public entity: Id,
		public velocity: Vector2,
	) { super() }
}

export class SelectNextItemAction extends GameUpdate {
	constructor(
		public entity: Id,
	) { super() }
}

export class PlaceBlockAction extends GameUpdate {
	constructor(
		public entity: Id,
		public position: Vector3,
	) { super() }
}
