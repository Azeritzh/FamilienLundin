import { Random } from "@lundin/age"
import { GridVector, MathF, Vector2 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks } from "../state/block"
import { Region } from "../state/region"
import { BlockSurroundings, VariationProvider } from "../variation-provider"
import { OverworldGeneration } from "../state/overworld-generation"
import { ChangeBlockService } from "../services/change-block-service"

export class RegionGenerator {
	private Region: Region
	private get FieldRegion() { return this.Region }
	private RegionSeed: number
	private RegionTimelineSeed: number
	private TerrainRandom: Random
	private TimelineRandom: Random

	private HeightMap: NoiseMap
	private HeightNoiseMap: NoiseMap
	private GrassMap: NoiseMap
	private GrassNoiseMap: NoiseMap
	private DirtMap: NoiseMap
	private DirtNoiseMap: NoiseMap

	constructor(
		private Config: GameConfig,
		private VariationProvider: VariationProvider,
		regionCoords: GridVector,
		overworldGeneration: OverworldGeneration,
		worldSeed: number,
		timelineSeed: number,
	) {
		this.Region = Region.New(regionCoords, Config.Constants.RegionSizeInChunks, Config.Constants.ChunkSize, overworldGeneration)
		this.RegionSeed = this.GetRegionSeed(worldSeed, regionCoords)
		this.RegionTimelineSeed = this.GetRegionSeed(timelineSeed, regionCoords)

		this.HeightMap = new NoiseMap(new Vector2(this.Region.Size.X, this.Region.Size.Y))
		this.HeightNoiseMap = new NoiseMap(new Vector2(32, 32))
		this.GrassMap = new NoiseMap(new Vector2(this.Region.Size.X, this.Region.Size.Y))
		this.GrassNoiseMap = new NoiseMap(new Vector2(32, 32))
		this.DirtMap = new NoiseMap(new Vector2(this.Region.Size.X, this.Region.Size.Y))
		this.DirtNoiseMap = new NoiseMap(new Vector2(32, 32))
	}

	private GetRegionSeed(worldSeed: number, regionCoords: GridVector) {
		const randomX = new Random(regionCoords.X).Generate()
		const randomY = new Random(regionCoords.Y).Generate()
		return Math.floor(randomX ^ randomY ^ worldSeed)
	}

	Generate() {
		this.InitialiseRandoms()
		this.GenerateNoiseMaps()
		this.GenerateBlocks()
		this.SetVariations()
		return this.Region
	}

	private InitialiseRandoms() {
		this.TerrainRandom = new Random(this.RegionSeed)
		this.TimelineRandom = new Random(this.RegionTimelineSeed)
	}

	private GenerateNoiseMaps() {
		const TerrainRandom = this.TerrainRandom
		this.HeightMap.Generate(20, TerrainRandom) // We want the heightmap to generate first, so it won't be influenced by changes in the other steps
		this.HeightNoiseMap.Generate(20, TerrainRandom)
		this.GrassMap.Generate(80, TerrainRandom)
		this.GrassNoiseMap.Generate(20, TerrainRandom)
		this.DirtMap.Generate(80, TerrainRandom)
		this.DirtNoiseMap.Generate(20, TerrainRandom)
	}

	private GenerateBlocks() {
		const Region = this.Region
		for (let x = Region.Offset.X; x < Region.Offset.X + Region.Size.X; x++)
			for (let y = Region.Offset.Y; y < Region.Offset.Y + Region.Size.Y; y++)
				this.GenerateInColumn(x, y)
	}

	private GenerateInColumn(x: number, y: number) {
		const Region = this.Region
		const height = this.GetHeight(new Vector2(x, y))
		for (let z = Region.Offset.Z; z < Region.Offset.Z + Region.Size.Z; z++)
			this.SetBlock(x, y, z, this.BlockFor(x, y, z, height))
	}

	private GetHeight(position: Vector2) {
		const Region = this.Region
		const height = this.HeightMap.ValueAt(position) * 3 + this.HeightNoiseMap.ValueAt(position) * 0.2

		const x = (position.X - Region.Offset.X) / Region.Size.X // normalised to 0..1
		const y = (position.Y - Region.Offset.Y) / Region.Size.Y // normalised to 0..1
		const nearnessToSouthEast = MathF.Max(0, x + y - 1)
		const nearnessToNorthEast = MathF.Max(0, x + 1 - y - 1)
		const nearnessToSouthWest = MathF.Max(0, 1 - x + y - 1)
		const nearnessToNorthWest = MathF.Max(0, 1 - x + 1 - y - 1)
		const borderHeight = Region.OverworldGeneration.NorthWestHeight * nearnessToNorthWest
			+ Region.OverworldGeneration.NorthEastHeight * nearnessToNorthEast
			+ Region.OverworldGeneration.SouthEastHeight * nearnessToSouthEast
			+ Region.OverworldGeneration.SouthWestHeight * nearnessToSouthWest

		const nearnessToBorder = MathF.Max(MathF.Abs(x - 0.5), MathF.Abs(y - 0.5)) * 2 // 1 at border, 0 at center
		const borderWeight = MathF.Pow(nearnessToBorder, 4)

		return Math.floor(borderWeight * borderHeight + (1 - borderWeight) * height)
	}

	private BlockFor(x: number, y: number, z: number, height: number) {
		const Config = this.Config
		if (this.IsRegionBorder(x, y, z))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-block"))
		if (this.IsHole(x, y))
			return Blocks.NewEmpty(Config.NonSolidTypeMap.TypeIdFor("air"))
		if (this.IsTower(x, y))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-flagstone"))
		return this.BaseLayerBlockFor(x, y, z - Math.floor(height))
	}

	private IsRegionBorder(x: number, y: number, z: number) {
		const localX = (x + 256) % 512
		const localY = (y + 256) % 512
		return z == 0 && (localX == 0 || localX == 511 || localY == 0 || localY == 511)
	}

	private IsHole(x: number, y: number) {
		return 10 < x && x <= 30
			&& 10 < y && y <= 30
	}

	private IsTower(x: number, y: number) {
		return 0 < x && x <= 50
			&& -50 <= y && y < -1
	}

	private BaseLayerBlockFor(x: number, y: number, z: number) {
		const Config = this.Config
		if (z < -3)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("darkstone"))
		if (z < -2)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-poor"))
		if (z < -1)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-rich"))
		if (z < 0) {
			const position = new Vector2(x, y)
			const grass = this.GrassMap.ValueAt(position) * 5 + this.GrassNoiseMap.ValueAt(position) * 0.5
			const dirt = this.DirtMap.ValueAt(position) * 2 + this.DirtNoiseMap.ValueAt(position) * 0.5
			if (grass > 1)
				return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("grass-rich"))
			return dirt > 1
				? Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-rich"))
				: Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-poor"))
		}
		return Blocks.NewEmpty(Config.NonSolidTypeMap.TypeIdFor("air"))
	}

	private SetVariations() {
		const Region = this.Region
		for (let x = Region.Offset.X; x < Region.Offset.X + Region.Size.X; x++)
			for (let y = Region.Offset.Y; y < Region.Offset.Y + Region.Size.Y; y++)
				for (let z = Region.Offset.Z; z < Region.Offset.Z + Region.Size.Z; z++)
					this.SetBlockWithVariation(x, y, z, this.Region.Get(x, y, z))
	}

	private SetBlock(x: number, y: number, z: number, block: Block) {
		this.Region.Set(x, y, z, block)
	}

	private SetBlockWithVariation(x: number, y: number, z: number, block: Block) {
		if (!this.VariationProvider.HasVariation(Blocks.SolidOf(block)))
			return
		const surroundings = new BlockSurroundings(
			block,
			this.Region.Contains(x, y - 1, z) ? this.Region.Get(x, y - 1, z) : block,
			this.Region.Contains(x + 1, y, z) ? this.Region.Get(x + 1, y, z) : block,
			this.Region.Contains(x, y + 1, z) ? this.Region.Get(x, y + 1, z) : block,
			this.Region.Contains(x - 1, y, z) ? this.Region.Get(x - 1, y, z) : block,
		)
		this.Region.Set(x, y, z, ChangeBlockService.GetVariationFor(block, surroundings, this.VariationProvider, this.TerrainRandom))
	}
}

class NoiseMap {
	constructor(
		private Size: Vector2
	) { }
	private Peaks: Vector2[] = []
	private Valleys: Vector2[] = []

	public Generate(numberOfPeaks: number, random: Random) {
		const Size = this.Size
		const Peaks = this.Peaks
		const Valleys = this.Valleys
		for (let i = 0; i < numberOfPeaks; i++)
			this.AddPointTo(Peaks, new Vector2(random.Float(Size.X), random.Float(Size.Y)))
		for (let i = 0; i < numberOfPeaks; i++)
			this.AddPointTo(Valleys, new Vector2(random.Float(Size.X), random.Float(Size.Y)))
	}

	private AddPointTo(list: Vector2[], point: Vector2) {
		const Size = this.Size
		list.push(point)
		if (point.X < Size.X / 2)
			list.push(point.withX(point.X + Size.X))
		else
			list.push(point.withX(point.X - Size.X))
		if (point.Y < Size.Y / 2)
			list.push(point.withY(point.Y + Size.Y))
		else
			list.push(point.withY(point.Y - Size.Y))
	}

	public ValueAt(point: Vector2) {
		point = this.Size.Contain(point)
		const closestPeak = this.Peaks.map(x => x.subtract(point).LengthSquared()).min()
		const closestValley = this.Valleys.map(x => x.subtract(point).LengthSquared()).min()
		return closestPeak / (closestPeak + closestValley)
	}
}
