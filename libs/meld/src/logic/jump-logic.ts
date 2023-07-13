import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameUpdate, JumpAction } from "../state/game-update"

export class JumpLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
		public Listeners: JumpListener[] = [],
	) { }

	Update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof JumpAction)
				this.Jump(action.Entity)
	}

	private Jump(entity: Id) {
		const velocity = this.Velocity.Of(entity) ?? Vector3.Zero
		const newVelocity = velocity.withZ(1)
		this.SetVelocity.For(entity, newVelocity)
		this.Notify(entity)
	}

	private Notify(entity: Id) {
		for (const listener of this.Listeners)
			listener.OnJump(entity)
	}
}

export interface JumpListener {
	OnJump(entity: Id): void
}
