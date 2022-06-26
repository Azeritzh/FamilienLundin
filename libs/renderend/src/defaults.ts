import { DisplayConfig } from "./display/display-config"
import { Input } from "./display/input-parser"

export const defaultDisplayConfig: DisplayConfig = {
	renderToVirtualSize: true,
	virtualPixelsPerTile: 16,
	virtualHeight: 160,
	font: "Vt323",
	assetFolder: "assets/",
	inputs: new Map([
		[Input.Restart, ["Escape", "Enter", "PadStart"]],
		[Input.MoveUp, ["KeyW", "ArrowUp", "PadUp"]],
		[Input.MoveDown, ["KeyS", "ArrowDown", "PadDown"]],
		[Input.MoveLeft, ["KeyA", "ArrowLeft", "PadLeft"]],
		[Input.MoveRight, ["KeyD", "ArrowRight", "PadRight"]],
		[Input.MoveSlow, ["ShiftLeft", "PadB"]],
	]),
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
