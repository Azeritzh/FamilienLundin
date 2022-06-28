import { Vector2 } from "@lundin/utility"

export abstract class MeldAction { }

export class GenerateAction extends MeldAction { }

export class MoveAction extends MeldAction {
	constructor(
		public velocity: Vector2,
	) { super() }
}
