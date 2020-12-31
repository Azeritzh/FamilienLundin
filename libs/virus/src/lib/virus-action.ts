import { range } from "@lundin/utility"
import { Virus } from "./virus"

export class VirusAction {
	origin: { x: number, y: number }
	destination: { x: number, y: number }

	constructor(
		public player: number,
		originX: number,
		originY: number,
		destinationX: number,
		destinationY: number,
	) {
		this.origin = { x: originX, y: originY }
		this.destination = { x: destinationX, y: destinationY }
	}
}

export function generateVirusActions(game: Virus) {
	const width = game.config.width
	const height = game.config.height
	const actions = []
	for (const i of range(0, width)) {
		for (const j of range(0, height)) {
			if (game.state.board.get(i, j) != 0)
				continue

			let exists = false
			for (const n of range(Math.max(0, i - 2), Math.min(width, i + 3))) {
				for (const m of range(Math.max(0, j - 2), Math.min(height, j + 3))) {
					if (game.state.board.get(n, m) != game.state.currentPlayer)
						continue
					const action = new VirusAction(game.state.currentPlayer, n, m, i, j)
					if (Math.abs(action.origin.x - action.destination.x) > 1 ||
						Math.abs(action.origin.y - action.destination.y) > 1) {
						actions.push(action)
					} else if (!exists) {
						actions.push(action)
						exists = true
					}
				}
			}
		}
	}
	return actions
}
