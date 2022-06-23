import { RectangularSize } from "@lundin/age"
import { DisplayConfig } from "./renderend-display"

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

export const defaultDisplayConfig: DisplayConfig = {
	font: "Vt323",
	assetFolder: "assets/",
	sprites: {
		"full-shield": {
			url: "full-shield.png",
			width: 20,
			height: 20,
			framesX: 4,
			framesY: 1,
			frameInterval: 10,
		},
		"half-shield": {
			url: "half-shield.png",
			width: 20,
			height: 20,
			framesX: 4,
			framesY: 1,
			frameInterval: 10,
		},
		"ship": {
			url: "ship.png",
			width: 20,
			height: 20,
			framesX: 4,
			framesY: 2,
			frameInterval: 6,
		},
		"wall": {
			url: "wall.png",
			width: 16,
			height: 16,
		},
		"obstacle": {
			url: "obstacle.png",
			width: 16,
			height: 16,
		},
		"obstacle-explosion": {
			url: "obstacle-explosion.png",
			width: 16,
			height: 16,
			framesX: 4,
			framesY: 1,
			frameInterval: 10,
		},
		"big-obstacle": {
			url: "big-obstacle.png",
			width: 32,
			height: 32,
		},
		"background": {
			url: "starry-background.png",
			width: 450,
			height: 160,
			centerX: 0,
			centerY: 0,
		},
	},
}
