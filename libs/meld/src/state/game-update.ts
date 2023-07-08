import { Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { GameState } from "./game-state"
import { Region } from "./region"

export abstract class GameUpdate { }

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

export class LoadPlayer extends GameUpdate {
	constructor(
		public Player: string,
	) { super() }
}

export class UnloadPlayer extends GameUpdate {
	constructor(
		public Player: string,
	) { super() }
}

export class LoadState extends GameUpdate {
	constructor(
		public State: GameState,
	) { super() }
}

export class LoadRegion extends GameUpdate {
	constructor(
		public Region: Region,
	) { super() }
}

export class MovementAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public Velocity: Vector2,
	) { super() }
}

export class UseItemAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public ActionState: ActionState,
		public Target: Vector3,
	) { super() }
}

export enum ActionState { Start, Unchanged, End }

export class SelectItemAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public ItemIndex: number,
	) { super() }
}

export class UseToolAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public PrimaryActionState: ActionState,
		public SecondaryActionState: ActionState,
		public Target: Vector3,
	) { super() }
}

export class SelectToolAction extends GameUpdate {
	constructor(
		public Entity: Id,
		public ToolIndex: number,
	) { super() }
}
