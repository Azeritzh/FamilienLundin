import { Vector2, Vector3 } from "@lundin/utility"

export abstract class MeldAction { }

export class GenerateAction extends MeldAction { }

export class MoveAction extends MeldAction {
	constructor(
		public velocity: Vector2,
	) { super() }
}

export class SelectNextItemAction extends MeldAction { }

export class PlaceBlockAction extends MeldAction {
	constructor(
		public block: Vector3,
	) { super() }
}
