export class DashState {
	constructor(
		public TimeOfLastDash = 0,
		public IsCharging = false,
		public HasFailedQuickDash = false,
		public Charge = 0,
		public Angle = 0
	) { }

	/// <summary>
	/// Calculates the smallest angular difference between the given angle and the angle of last dash
	/// </summary>
	AbsoluteAngularDifferenceTo(angle: number) {
		if (angle >= Math.PI * 2)
			angle -= Math.PI * 2
		else if (angle < 0)
			angle += Math.PI * 2

		const relative = angle < this.Angle
			? this.Angle - angle
			: angle - this.Angle
		return relative > Math.PI
			? Math.PI * 2 - relative
			: relative
	}

	IsInInterval(time: number, start: number, end: number) {
		const timeSinceLastDash = time - this.TimeOfLastDash
		return start <= timeSinceLastDash && timeSinceLastDash < end
	}

	IsWithinAngle(newAngle: number, minimumAngle: number) {
		return this.AbsoluteAngularDifferenceTo(newAngle) > minimumAngle
	}
}
