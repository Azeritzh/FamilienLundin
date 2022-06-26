import { Vector2 } from "@lundin/utility"

export abstract class RenderendAction { }

export class StartGameAction extends RenderendAction { }

export class MoveShipAction extends RenderendAction {
	constructor(
		public velocity: Vector2,
	) { super() }
}

export class ShootBulletAction extends RenderendAction { }