import { Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { GameState } from "./game-state"

export abstract class GameUpdate { }

export class GenerateAction extends GameUpdate { }

export class ChargeDashAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public Angle: number
	) { super() }
}

export class ReleaseDashAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public Angle: number
	) { super() }
}

export class LoadState extends GameUpdate {
	constructor(
		public State: GameState,
	) { super() }
}

export class MovementAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public Velocity: Vector2,
	) { super() }
}

export class PlaceBlockAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public Position: Vector3,
	) { super() }
}

export class SelectNextItemAction extends GameUpdate {
	constructor(
		public Entity: Id,
	) { super() }
}
