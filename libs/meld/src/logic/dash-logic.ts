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
		public Listeners: DashListener[] = [],
	) { }

	Update(actions: GameUpdate[]) {
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
			state.HasFailedQuickDash,
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
		if (this.CooldownHasPassed(state))
			this.SetDashState.For(entity, new DashState(
				state.TimeOfLastDash,
				true,
				false,
				state.Charge + this.Constants.DashChargeSpeed,
				angle,
			))
	}

	private CooldownHasPassed(state: DashState) {
		const timeSinceLastDash = this.Globals.Tick - state.TimeOfLastDash
		return timeSinceLastDash > this.Constants.DashCooldown
	}

	private ReleaseDash(entity: Id, angle: number) {
		const state = this.DashState.CurrentlyOf(entity) ?? new DashState()
		if (!this.CanQuickDash(state, angle) && !state.IsCharging) {
			this.SetDashState.For(entity, new DashState(
				state.TimeOfLastDash,
				state.IsCharging,
				true,
				state.Charge,
				state.Angle,
			))
			this.Notify(entity, false, new DashState(
				state.TimeOfLastDash,
				state.IsCharging,
				state.HasFailedQuickDash,
				state.Charge,
				angle,
			))
			return
		}

		const strength = Math.min(state.Charge + this.Constants.InitialDashCharge, this.Constants.MaxDashCharge)
		this.SetDashState.For(entity, new DashState(
			this.Globals.Tick,
			false,
			state.HasFailedQuickDash,
			0,
			angle,
		))

		const verticalVelocity = this.Velocity.Of(entity)?.z ?? 0
		const newVelocity = new Vector3(strength, 0, 0).rotate(angle)
		newVelocity.z = verticalVelocity
		this.SetVelocity.For(entity, newVelocity)
		this.SetGravityBehaviour.For(entity, false)
		this.Notify(entity, true, new DashState(
			state.TimeOfLastDash,
			state.IsCharging,
			state.HasFailedQuickDash,
			state.Charge,
			angle,
		))
	}

	private CanQuickDash(state: DashState, newAngle: number) {
		return !state.HasFailedQuickDash
			&& state.IsInInterval(this.Globals.Tick, this.Constants.QuickDashWindowStart, this.Constants.QuickDashWindowEnd)
			&& state.IsWithinAngle(newAngle, this.Constants.QuickDashMinimumAngle)
	}

	private Notify(entity: Id, success: boolean, state: DashState) {
		for(const listener of this.Listeners)
			listener.OnDash(entity, success, state)
	}
}

export interface DashListener {
	OnDash: (entity: Id, success: boolean, state: DashState) => void
}
