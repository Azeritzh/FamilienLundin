export abstract class MinestrygerAction { }

export class RevealAction extends MinestrygerAction {
	constructor(
		public x: number,
		public y: number,
	) { super() }
}