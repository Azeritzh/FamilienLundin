import { RectangularSize } from "@lundin/age"
import { Behaviour } from "./state/entity-values"

export const defaultConstants = {
	shipType: "ship",
	wallType: "wall",
	obstacleTypes: ["obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "big-obstacle"],
}

export const defaultValues = {
	ship: {
		behaviours: [Behaviour.Ship, Behaviour.Velocity, Behaviour.DieOnCollision],
		shipBehaviour: true,
		dieOnCollisionBehaviour: true,
	},
	wall: {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
	},
	obstacle: {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
	},
	"big-obstacle": {
		behaviours: [Behaviour.Obstacle, Behaviour.Velocity, Behaviour.HasRectangularSize],
		rectangularSize: new RectangularSize(2, 2),
		obstacleBehaviour: true,
	},
}