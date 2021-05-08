import { GameGrid, GameState } from "@lundin/age"
import { KingdomsConfig } from "./kingdoms-config"

export class KingdomsState implements GameState {

	constructor(
		config: KingdomsConfig,
		public board = new GameGrid<Field>(config.width, config.height, () => new Field()),
		public tick = 0,
	) { }
}

export enum FieldType { Plains, Forest, Marsh, Highlands, Mountain, Water }

export class Field {
	constructor(
		public type = randomFieldType()
	) { }
}

function randomFieldType() {
	const types = [FieldType.Plains, FieldType.Forest, FieldType.Marsh, FieldType.Highlands, FieldType.Mountain, FieldType.Water]
	return types[Math.floor(Math.random() * 6)]
}
