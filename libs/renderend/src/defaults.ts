import { RectangularSize } from "@lundin/age"

export const defaultConstants = {
	shipType: "ship",
	wallType: "wall",
	obstacleTypes: ["obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "obstacle", "big-obstacle"],
}

export const defaultValues = {
	ship: {
		shipBehaviour: true,
		dieOnCollisionBehaviour: true,
	},
	wall: {
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
	},
	obstacle: {
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
	},
	"big-obstacle": {
		rectangularSize: new RectangularSize(2, 2),
		obstacleBehaviour: true,
	},
}