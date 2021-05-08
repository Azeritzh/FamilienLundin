import { GameGrid, GameState } from "@lundin/age"
import { KingdomsConfig } from "./kingdoms-config"

export class KingdomsState implements GameState {

	constructor(
		config: KingdomsConfig,
		public board = new GameGrid<Field>(config.width, config.height, () => new Field()),
		public tick = 0,
	) { }
}

export enum Terrain { Water, Flat, Hilly, Mountainous }
export enum Fertility { None, Low, High }

export class Field {
	constructor(
		public terrain: Terrain = randomTerrain(),
		public fertility: Fertility = randomFertility(),
	) { }
}

function randomTerrain() {
	const types = [Terrain.Water, Terrain.Flat, Terrain.Hilly, Terrain.Mountainous]
	return types[Math.floor(Math.random() * 4)]
}

function randomFertility() {
	const types = [Fertility.None, Fertility.Low, Fertility.High]
	return types[Math.floor(Math.random() * 3)]
}
