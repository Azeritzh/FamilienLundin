import { Random } from "@lundin/age"
import { GridVector } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks, SolidId } from "../state/block"
import { Region as StateRegion } from "../state/region"

export class RegionGenerator {
	constructor(
		private Config: GameConfig,
		private VariationProvider: VariationProvider,
		private RegionCoords: GridVector,
		private WorldSeed: number,
		private TimelineSeed: number,

		private Region = StateRegion.New(RegionCoords, Config.Constants.RegionSizeInChunks, Config.Constants.ChunkSize),
		private Surroundings = new BlockSurroundings(0, 0, 0, 0, 0),
		private random = new Random(WorldSeed),
	) { }

	Generate() {
		this.GenerateBlocks()
		this.SetVariations()
		return this.Region
	}

	private GenerateBlocks() {
		const Region = this.Region
		for (let x = Region.Offset.X; x < Region.Offset.X + Region.Size.X; x++)
			for (let y = Region.Offset.Y; y < Region.Offset.Y + Region.Size.Y; y++)
				for (let z = Region.Offset.Z; z < Region.Offset.Z + Region.Size.Z; z++)
					this.Region.Set(x, y, z, this.BlockFor(x, y, z))
	}

	private BlockFor(x: number, y: number, z: number) {
		const Config = this.Config
		if (this.IsRegionBorder(x, y, z))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-block"))
		if (this.IsHole(x, y))
			return Blocks.NewEmpty(Config.NonSolidTypeMap.TypeIdFor("air"))
		if (this.IsTower(x, y))
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("stone-flagstone"))
		return this.BaseLayerBlockFor(z)
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

	private BaseLayerBlockFor(z: number) {
		const Config = this.Config
		if (z < -3)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("darkstone"))
		if (z < -2)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-poor"))
		if (z < -1)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("soil-rich"))
		if (z < 0)
			return Blocks.NewFull(Config.SolidTypeMap.TypeIdFor("grass-rich"))
		return Blocks.NewEmpty(Config.NonSolidTypeMap.TypeIdFor("air"))
	}

	private SetVariations() {
		const Region = this.Region
		for (let x = Region.Offset.X; x < Region.Offset.X + Region.Size.X; x++)
			for (let y = Region.Offset.Y; y < Region.Offset.Y + Region.Size.Y; y++)
				for (let z = Region.Offset.Z; z < Region.Offset.Z + Region.Size.Z; z++)
					this.Region.Set(x, y, z, this.GetVariationFor(x, y, z))
	}

	private GetVariationFor(x: number, y: number, z: number) {
		const block = this.Region.Get(x, y, z)
		if (!this.VariationProvider.HasVariation(Blocks.SolidOf(block)))
			return block
		this.Surroundings.Block = block
		const variation = this.VariationProvider.GetVariationFor(this.Surroundings, this.random.Float())
		return Blocks.WithVariation(block, variation)
	}
}

// TODO: put in other file:
interface VariationProvider {
	HasVariation(solid: SolidId): boolean
	GetVariationFor(surroundings: BlockSurroundings, random: number): number
}

export class DummyVariationProvider implements VariationProvider {
	HasVariation(): boolean {
		return false
	}

	GetVariationFor(): number {
		return 0
	}
}

class BlockSurroundings {
	constructor(
		public Block: Block,
		public NorthBlock: Block,
		public EastBlock: Block,
		public SouthBlock: Block,
		public WestBlock: Block,
	) { }
}
