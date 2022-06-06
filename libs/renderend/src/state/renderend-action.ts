export abstract class RenderendAction { }

export class StartGameAction extends RenderendAction { }

export class MoveShipAction extends RenderendAction {
	constructor(
		public horisontalSpeed: number,
		public verticalSpeed: number,
	) { super() }
}
