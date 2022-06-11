import { Behaviour } from "./state/entity-values"
import { RectangularSize } from "./values/rectangular-size"

export const defaultConstants = {
	shipType: "ship",
	wallType: "obstacle",
	obstacleTypes: ["obstacle"],
}

export const defaultValues = {
	ship: {
		behaviours: [Behaviour.Ship, Behaviour.Velocity, Behaviour.DieOnCollision]
	},
	obstacle: {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(1, 1),
	}
}