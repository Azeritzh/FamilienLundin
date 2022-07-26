import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { DashState } from "../../values/dash-state"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig, DurationOf } from "../state/display-config"
import { DisplayEntityDrawer } from "../display-entity-drawer"
import { AngleOf, DisplayState } from "../state/display-state"
import { EntityContext } from "./entity-context"

export class DashDrawer {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
		private DisplayEntityDrawer: DisplayEntityDrawer,
	) { }

	Draw(context: EntityContext) {
		this.EntityContext = context
		const dashState = this.Game.Entities.DashState.Get.Of(context.Entity)
		if (!dashState)
			return

		const position = this.Game.Entities.Position.Get.Of(context.Entity) ?? new Vector3(0, 0, 0)
		const velocity = this.Game.Entities.Velocity.Get.Of(context.Entity) ?? new Vector3(0, 0, 0)
		if (this.ShouldShowRecharge(dashState))
			this.Camera.DrawAnimated(this.Config.GameplaySprites.DashRecharge, Layer.Middle - Layer.ZFightingAdjustment, position, velocity, dashState.TimeOfLastDash + this.Game.Config.Constants.DashCooldown)
		if (dashState.IsCharging)
			this.Camera.DrawAnimated(this.Config.GameplaySprites.DashTarget, Layer.Middle, this.TargetPosition(dashState).addFrom(position), velocity, 0, dashState.Angle - AngleOf(this.State.ViewDirection))
		if (this.IsInQuickDashWindow(dashState))
			this.ShowQuickDashAngle(dashState, position, velocity)
	}

	private ShouldShowRecharge(dashState: DashState) {
		const timeSinceEndedCooldown = this.Game.State.Globals.Tick - dashState.TimeOfLastDash - this.Game.Config.Constants.DashCooldown
		const animationDuration = DurationOf(this.Config.Sprites[this.Config.GameplaySprites.DashRecharge])
		return 0 < timeSinceEndedCooldown && timeSinceEndedCooldown < animationDuration
	}

	private IsInQuickDashWindow(dashState: DashState) {
		return dashState.IsInInterval(this.Game.State.Globals.Tick, this.Game.Config.Constants.QuickDashWindowStart, this.Game.Config.Constants.QuickDashWindowEnd)
	}

	private ShowQuickDashAngle(dashState: DashState, position: Vector3, velocity: Vector3) {
		const quickDashWindowStart = dashState.TimeOfLastDash + this.Game.Config.Constants.QuickDashWindowStart
		const minimumAngle = this.Game.Config.Constants.QuickDashMinimumAngle
		const angleA = new Vector3(1, 0, 0).rotate(dashState.Angle + minimumAngle)
		const angleB = new Vector3(1, 0, 0).rotate(dashState.Angle - minimumAngle)
		const sprite = dashState.HasFailedQuickDash ? this.Config.GameplaySprites.DashFailMarker : this.Config.GameplaySprites.DashMarker
		this.Camera.DrawAnimated(sprite, Layer.Middle, angleA.addFrom(position), velocity, quickDashWindowStart)
		this.Camera.DrawAnimated(sprite, Layer.Middle, angleB.addFrom(position), velocity, quickDashWindowStart)
	}

	private TargetPosition(dashState: DashState) {
		const charge = 20 * Math.min(this.Game.Config.Constants.MaxDashCharge - this.Game.Config.Constants.InitialDashCharge, dashState.Charge)
		return new Vector3(charge, 0, 0).rotate(dashState.Angle)
	}

	public OnDash(entity: Id, success: boolean, state: DashState) {
		const position = this.Game.Entities.Position.Get.Of(entity) ?? new Vector3(0, 0, 0)
		if (success) {
			this.DisplayEntityDrawer.Add(this.Config.GameplaySprites.DashCloud, position, new Vector3(0, 0, 0))
			if (state.IsCharging)
				this.DisplayEntityDrawer.Add(this.Config.GameplaySprites.DashTargetFade, this.TargetPosition(state).addFrom(position), new Vector3(0, 0, 0), state.Angle - AngleOf(this.State.ViewDirection))
		}
		else
			this.DisplayEntityDrawer.AddRelative(this.Config.GameplaySprites.DashFail, entity, new Vector3(1, 0, 0).rotate(state.Angle))
	}
}
