import { GameGrid, GameState } from "@lundin/age"
import { randomIntBelow } from "@lundin/utility"
import { KingdomsConfig } from "./kingdoms-config"

export class KingdomsState implements GameState {

	constructor(
		config: KingdomsConfig,
		public players: Player[] = [new Player(1, "Kristjan", "blue"), new Player(2, "Daniel", "red")],
		public board = createNewBoard(config.width, config.height, players),
		public tick = 0,
	) { }
}

export enum Terrain { Water, Flat, Hilly, Mountainous }
export enum Fertility { None, Low, High }

export class Field {
	constructor(
		public terrain: Terrain = randomTerrain(),
		public fertility: Fertility = randomFertility(),
		public controller: number = null,
		public districts: District[] = [],
		public buildings: any[] = [],
	) { }
}

function createNewBoard(width: number, height: number, players: Player[]) {
	const board = new GameGrid<Field>(width, height, () => new Field())
	for (const player of players)
		setupStartFieldFor(player, board)
	return board
}

function setupStartFieldFor(player: Player, board: GameGrid<Field>) {
	let field = getRandomField(board)
	while (field.controller || field.terrain === Terrain.Water)
		field = getRandomField(board)
	field.controller = player.id
	field.districts.push(new District(DistrictType.City, 1, 1))
	field.districts.push(new District(DistrictType.Agricultural, 1, 1))
}

function getRandomField(board: GameGrid<Field>) {
	return board.get(randomIntBelow(board.width), randomIntBelow(board.height))
}

function randomTerrain() {
	const types = [Terrain.Water, Terrain.Flat, Terrain.Hilly, Terrain.Mountainous]
	return types[Math.floor(Math.random() * 4)]
}

function randomFertility() {
	const types = [Fertility.None, Fertility.Low, Fertility.High]
	return types[Math.floor(Math.random() * 3)]
}

export class District {
	constructor(
		public type: DistrictType = DistrictType.Agricultural,
		public population: number = 1,
		public quality: number = 0,
	) { }
}

export enum DistrictType { Agricultural, City }

export class Player {
	constructor(
		public id: number,
		public name: string,
		public color: string,
	) { }
}
