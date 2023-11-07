import { DoubleValleyNoiseMap, NoiseMap, Random } from "@lundin/age"
import { GridVector, MathF, Vector2, Vector3 } from "@lundin/utility"
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
		this.TerrainRandom = new Random(this.RegionSeed)
		this.TimelineRandom = new Random(this.RegionTimelineSeed)

		const TerrainRandom = this.TerrainRandom
		const regionSize = new Vector2(this.Region.Size.X, this.Region.Size.Y)
		this.HeightMap = new DoubleValleyNoiseMap(regionSize, 20, TerrainRandom) // We want the heightmap to generate first, so it won't be influenced by changes in the other steps
		this.HeightNoiseMap = new DoubleValleyNoiseMap(new Vector2(32, 32), 20, TerrainRandom)
		this.GrassMap = new DoubleValleyNoiseMap(regionSize, 80, TerrainRandom)
		this.GrassNoiseMap = new DoubleValleyNoiseMap(new Vector2(32, 32), 20, TerrainRandom)
		this.DirtMap = new DoubleValleyNoiseMap(regionSize, 80, TerrainRandom)
		this.DirtNoiseMap = new DoubleValleyNoiseMap(new Vector2(32, 32), 20, TerrainRandom)
	}

	private GetRegionSeed(worldSeed: number, regionCoords: GridVector) {
		const randomX = new Random(regionCoords.X).Generate()
		const randomY = new Random(regionCoords.Y).Generate()
		return Math.floor(randomX ^ randomY ^ worldSeed)
	}

	Generate() {
		this.GenerateBlocks()
		this.SetVariations()
		return this.Region
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
		if (this.TerrainRandom.Float() < 0.02) {
			const id = this.Config.EntityTypeMap.TypeIdFor("bush") | Region.EntitiesToBeCreated.size
			const values = { BlockPosition: new Vector3(x, y, height) }
			Region.EntitiesToBeCreated.set(id, values)
		}
	}

	private GetHeight(position: Vector2) {
		const Region = this.Region
		const height = this.HeightMap.ValueAt(position) * 3 + this.HeightNoiseMap.ValueAt(position) * 0.2

		const x = (position.X - Region.Offset.X) / Region.Size.X // normalised to 0..1
		const y = (position.Y - Region.Offset.Y) / Region.Size.Y // normalised to 0..1
		const baseHeight = this.GetBaseHeight(x, y)

		const nearnessToBorder = MathF.Max(MathF.Abs(x - 0.5), MathF.Abs(y - 0.5)) * 2 // 1 at border, 0 at center
		const heightMapWeight = 1 - MathF.Pow(nearnessToBorder, 4)

		return MathF.Round(baseHeight + heightMapWeight * height)
	}

	private GetBaseHeight(x: number, y: number) {
		const Region = this.Region
		const nearnessToSouthEast = MathF.Max(0, x + y - 1)
		const nearnessToNorthEast = MathF.Max(0, x + 1 - y - 1)
		const nearnessToSouthWest = MathF.Max(0, 1 - x + y - 1)
		const nearnessToNorthWest = MathF.Max(0, 1 - x + 1 - y - 1)
		const nearnessToCenter = 1 - nearnessToNorthWest - nearnessToNorthEast - nearnessToSouthEast - nearnessToSouthWest
		const averageHeight = (Region.OverworldGeneration.NorthWestHeight + Region.OverworldGeneration.NorthEastHeight + Region.OverworldGeneration.SouthEastHeight + Region.OverworldGeneration.SouthWestHeight) / 4
		return Region.OverworldGeneration.NorthWestHeight * nearnessToNorthWest
			+ Region.OverworldGeneration.NorthEastHeight * nearnessToNorthEast
			+ Region.OverworldGeneration.SouthEastHeight * nearnessToSouthEast
			+ Region.OverworldGeneration.SouthWestHeight * nearnessToSouthWest
			+ averageHeight * nearnessToCenter
	}

	private BlockFor(x: number, y: number, z: number, height: number) {
		const Config = this.Config
		if (this.IsRegionBorder(x, y, z, height))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-block"))
		if (this.IsHole(x, y))
			return Blocks.NewEmpty(Config.NonSolidTypeMap.TypeIdFor("air"))
		if (this.IsTower(x, y))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-flagstone"))
		if (this.IsDisplayArea(x, y, z, height))
			return this.DisplayBlockFor(x, y)
		return this.BaseLayerBlockFor(x, y, z, height)
	}

	private IsRegionBorder(x: number, y: number, z: number, height: number) {
		const localX = (x + 256) % 512
		const localY = (y + 256) % 512
		return z == height && (localX == 0 || localX == 511 || localY == 0 || localY == 511)
	}

	private IsHole(x: number, y: number) {
		return 20 < x && x <= 40
			&& -30 <= y && y < -10
	}

	private IsTower(x: number, y: number) {
		return 40 < x && x <= 60
			&& -30 <= y && y < -10
	}

	private IsDisplayArea(x: number, y: number, z: number, height: number) {
		return z - height == 0
			&& 10 < x && x <= 20
			&& -30 <= y && y < -10
	}

	private DisplayBlockFor(x: number, y: number) {
		const Config = this.Config
		const offset = x - 10
		const type = this.switch(offset)
		if (y == -30)
			return Blocks.NewHalf(Config.SolidTypeMap.TypeIdFor(type), Config.NonSolidTypeMap.TypeIdFor("air"))
		if (y == -20)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor(type))
		return Blocks.NewFloor(Config.SolidTypeMap.TypeIdFor(type), Config.NonSolidTypeMap.TypeIdFor("air"))
	}

	private switch(offset: number) {
		switch (offset) {
			case 1: return "darkwood-beam"
			case 2: return "darkwood-planks"
			case 3: return "wood-beam"
			case 4: return "wood-planks"
			case 5: return "lightwood-beam"
			case 6: return "lightwood-planks"
			case 7: return "darkstone-flagstone"
			case 8: return "darkstone-block"
			case 9: return "stone-flagstone"
			case 10: return "stone-block"
			default: "wood"
		}
	}

	private BaseLayerBlockFor(x: number, y: number, z: number, height: number) {
		const Config = this.Config
		if (z - height < -3)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("darkstone"))
		if (z - height < -2)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-poor"))
		if (z - height < -1)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-rich"))
		if (z - height < 0) {
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
