export class EntitySprites {
	constructor(
		public Rotations: RotationSprite[],
		public HammerStrike?: RotationSprite[]
	) { }
}

export class RotationSprite {
	constructor(
		public EndAngle = 1,
		public Sprite = "missing-sprite",
	) { }
}

export function SpriteFor(rotations: RotationSprite[], angle: number) {
	if (rotations.length == 0)
		return "missing-sprite"
	const normalisedAngle = angle / (Math.PI * 2)
	for (const rotation of rotations)
		if (normalisedAngle < rotation.EndAngle)
			return rotation.Sprite
	return rotations[0].Sprite
}
