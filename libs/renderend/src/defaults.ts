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
		health: 3,
		damage: 1,
	},
	wall: {
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
		damage: 3,
	},
	obstacle: {
		rectangularSize: new RectangularSize(1, 1),
		obstacleBehaviour: true,
		health: 1,
		damage: 1,
	},
	"big-obstacle": {
		rectangularSize: new RectangularSize(2, 2),
		obstacleBehaviour: true,
		damage: 3,
	},
}