import { Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"

export abstract class MeldAction { }

export class GenerateAction extends MeldAction { }

export class MovementAction extends MeldAction {
	constructor(
		public entity: Id,
		public velocity: Vector2,
	) { super() }
}

export class SelectNextItemAction extends MeldAction {
	constructor(
		public entity: Id,
	) { super() }
}

export class PlaceBlockAction extends MeldAction {
	constructor(
		public entity: Id,
		public position: Vector3,
	) { super() }
}
