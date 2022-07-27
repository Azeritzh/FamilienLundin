import { updatesPerSecond } from "../../meld-game"

export class ItemAnimations {
	constructor(
		public HammerStrike: ItemAnimation[] = []
	) { }

	static From(object: any) {
		return new ItemAnimations(
			object.HammerStrike?.map(x => ItemAnimation.From(x)) ?? []
		)
	}
}

export class ItemAnimation {
	constructor(
		public ItemFrames: ItemFrame[] = [],
		public EndAngle = 1,
	) { }

	static From(object: any) {
		const animation = Object.assign(new ItemAnimation(), object)
		animation.ItemFrames = object.ItemFrames?.map(x => ItemFrame.From(x)) ?? []
		return animation
	}
}

export class ItemFrame {
	constructor(
		public EndTime = 1,
		public Placement?: ItemPlacement,
	) { }

	static From(object: any) {
		const frame = Object.assign(new ItemFrame(), object)
		frame.Placement = object.Placement ? ItemPlacement.From(object.Placement) : null
		return frame
	}
}

export class ItemPlacement {
	constructor(
		public OffsetX = 0,
		public OffsetY = 0,
		public Rotation = 0,
		public InFront = false,
	) { }

	static From(object: any) {
		return Object.assign(new ItemPlacement(), object)
	}
}

export function ItemPlacementFor(rotations: ItemAnimation[], angle: number, time: number) {
	const frames = AnimationFor(rotations, angle)
	if (!frames)
		return null
	return PlacementFor(frames, time)
}

function AnimationFor(rotations: ItemAnimation[], angle: number) {
	if (rotations.length == 0)
		return null
	const normalisedAngle = angle / (Math.PI * 2)
	for (const rotation of rotations)
		if (normalisedAngle < rotation.EndAngle)
			return rotation.ItemFrames
	return rotations[0].ItemFrames
}

function PlacementFor(frames: ItemFrame[], time: number) {
	if (frames.length == 0)
		return null
	for (const frame of frames)
		if (time < Math.floor(frame.EndTime * updatesPerSecond))
			return frame.Placement
	return null
}
