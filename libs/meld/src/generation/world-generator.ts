import { DoubleValleyNoiseMap, Random } from "@lundin/age"
import { GridVector, Vector2 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { OverworldGeneration } from "../state/overworld-generation"
import { VariationProvider } from "../variation-provider"
import { RegionGenerator } from "./region-generator"

export class WorldGenerator {
	private ContinentOffset: Vector2
	private ContinentSize: Vector2

	constructor(
		private Config: GameConfig,
		private VariationProvider: VariationProvider,
		private WorldSeed: number,
		private TimelineSeed: number,
	) {
		const random = new Random(WorldSeed)
		this.ContinentSize = new Vector2(16, 16)
		this.ContinentOffset = new Vector2(random.Int(16), random.Int(16))
	}

	public GetGeneratorFor(regionCoords: GridVector) {
		const heightMap = new DoubleValleyNoiseMap(new Vector2(10, 10), 40, new Random(this.WorldSeed))
		const overworldGeneration = new OverworldGeneration("default",
			Math.floor(heightMap.ValueAt(new Vector2(regionCoords.X, regionCoords.Y)) * 5),
			Math.floor(heightMap.ValueAt(new Vector2(regionCoords.X + 1, regionCoords.Y)) * 5),
			Math.floor(heightMap.ValueAt(new Vector2(regionCoords.X + 1, regionCoords.Y + 1)) * 5),
			Math.floor(heightMap.ValueAt(new Vector2(regionCoords.X, regionCoords.Y + 1)) * 5),
			"grass-rich", "grass-rich", "grass-rich", "grass-rich")

		const generator = new RegionGenerator(this.Config, this.VariationProvider, regionCoords, overworldGeneration, this.WorldSeed, this.TimelineSeed)
		return generator
	}
}
