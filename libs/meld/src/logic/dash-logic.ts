import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { ChargeDashAction, GameUpdate, ReleaseDashAction } from "../state/game-update"
import { Globals } from "../state/globals"
import { MeldEntities } from "../state/meld-entities"
import { DashState } from "../values/dash-state"

export class DashLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Globals: Globals,
		private Entities: MeldEntities,
		private DashState: ValueGetter<DashState>,
		private SetDashState: ValueSetter<DashState>,
		private GravityBehaviour: ValueGetter<boolean>,
		private SetGravityBehaviour: ValueSetter<boolean>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update(actions: GameUpdate[]) {
		for (const [entity, state] of this.Entities.With.DashState)
			if (state.IsCharging)
				this.ChargeDash(entity, state)
			else if (this.DashEffectShouldEnd(state))
				this.EndDashEffect(entity)

		for (const action of actions)
			if (action instanceof ChargeDashAction)
				this.UpdateCharge(action.Entity, action.Angle)
			else if (action instanceof ReleaseDashAction)
				this.ReleaseDash(action.Entity, action.Angle)
	}

	private ChargeDash(entity: Id, state: DashState) {
		this.SetDashState.For(entity, new DashState(
			state.TimeOfLastDash,
			state.IsCharging,
			state.Charge + this.Constants.DashChargeSpeed,
			state.Angle,
		))
	}

	private DashEffectShouldEnd(state: DashState) {
		const timeSinceLastDash = this.Globals.Tick - state.TimeOfLastDash
		return timeSinceLastDash == this.Constants.DashDuration
	}

	private EndDashEffect(entity: Id) {
		this.SetGravityBehaviour.For(entity, this.GravityBehaviour.DefaultOf(entity) ?? true) // TODO: DefaultOf probably shouldn't return a nullable?
	}

	private UpdateCharge(entity: Id, angle: number) {
		const state = this.DashState.CurrentlyOf(entity) ?? new DashState()
		const timeSinceLastDash = this.Globals.Tick - state.TimeOfLastDash
		if (this.CooldownHasPassed(timeSinceLastDash) || this.CanQuickCharge(timeSinceLastDash, angle, state.Angle))
			this.SetDashState.For(entity, new DashState(
				state.TimeOfLastDash,
				true,
				state.Charge + this.Constants.DashChargeSpeed,
				angle,
			))
	}

	private CooldownHasPassed(timeSinceLastDash: number) {
		return timeSinceLastDash > this.Constants.DashCooldown
	}

	private CanQuickCharge(timeSinceLastDash: number, newAngle: number, oldAngle: number) {
		return this.Constants.DashQuickChargeWindowStart < timeSinceLastDash && timeSinceLastDash < this.Constants.DashQuickChargeWindowEnd
			&& Math.abs(newAngle - oldAngle) > this.Constants.DashQuickChargeMinimumAngle
	}

	private ReleaseDash(entity: Id, angle: number) {
		const state = this.DashState.CurrentlyOf(entity) ?? new DashState()
		if (!state.IsCharging)
			return

		const strength = Math.min(state.Charge + this.Constants.InitialDashCharge, this.Constants.MaxDashCharge)
		this.SetDashState.For(entity, new DashState(
			this.Globals.Tick,
			false,
			0,
			angle,
		))

		const oldVelocity = this.Velocity.Of(entity) ?? new Vector3(0, 0, 0)
		const dashVelocity = new Vector3(strength, 0, 0).rotate(angle)
		const newVelocity = dashVelocity.add(oldVelocity)
		this.SetVelocity.For(entity, newVelocity)
		this.SetGravityBehaviour.For(entity, false)
	}
}
