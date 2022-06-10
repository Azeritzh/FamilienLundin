export abstract class RenderendAction { }

export class StartGameAction extends RenderendAction { }

export class MoveShipVerticallyAction extends RenderendAction {
	constructor(
		public speed: number,
	) { super() }
}

export class MoveShipHorisontallyAction extends RenderendAction {
	constructor(
		public speed: number,
	) { super() }
}
