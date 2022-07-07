import { Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { GameState } from "./game-state"

export abstract class GameUpdate { }

export class GenerateAction extends GameUpdate { }

export class LoadState extends GameUpdate {
	constructor(
		public state: GameState,
	) { super() }
}

export class MovementAction extends GameUpdate {
	constructor(
		public entity: Id,
		public velocity: Vector2,
	) { super() }
}

export class PlaceBlockAction extends GameUpdate {
	constructor(
		public entity: Id,
		public position: Vector3,
	) { super() }
}

export class SelectNextItemAction extends GameUpdate {
	constructor(
		public entity: Id,
	) { super() }
}
