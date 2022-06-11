import { Behaviour } from "./state/entity-values"
import { RectangularSize } from "./values/rectangular-size"

export const defaultConstants = {
	shipType: "ship",
	wallType: "wall",
	obstacleTypes: ["obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "big-obstacle"],
}

export const defaultValues = {
	ship: {
		behaviours: [Behaviour.Ship, Behaviour.Velocity, Behaviour.DieOnCollision]
	},
	wall: {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(1, 1),
	},
	obstacle: {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(1, 1),
	},
	"big-obstacle": {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(2, 2),
	},
}