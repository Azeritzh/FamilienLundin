import { BlockChunk, FieldRegion, Id, RegionCoordsFor, TypeMap } from "@lundin/age"
import { GridVector, Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Version } from "../config/version"
import { Block, Blocks } from "./block"
import { EntityValues, GroupedEntityValues, SerialisableEntities } from "./entity-values"

export class Region extends FieldRegion<Block>{
	constructor(
		public Size: GridVector,
		public ChunkSize: GridVector,
		public Offset: GridVector,
		public Chunks: BlockChunk<Block>[],
		public EntityValues: EntityValues
	) { super(Size, ChunkSize, Offset, Chunks) }

	public RegionCoords = () => RegionCoordsFor(this.Offset.X, this.Offset.Y, this.Offset.Z, this.Size)

	public static New(regionCoords: GridVector, sizeInChunks: GridVector, chunkSize: GridVector): Region {
		const size = new Vector3(
			sizeInChunks.X * chunkSize.X,
			sizeInChunks.Y * chunkSize.Y,
			sizeInChunks.Z * chunkSize.Z
		)
		const offset = new Vector3(
			regionCoords.X * size.X - size.X / 2, // subtracting half the region size in order to center region (0,0,0) on block (0,0,0)
			regionCoords.Y * size.Y - size.Y / 2,
			regionCoords.Z * size.Z - size.Z / 2
		)

		const chunks: BlockChunk<Block>[] = new Array(sizeInChunks.X * sizeInChunks.Y * sizeInChunks.Z)
		for (let x = 0; x < sizeInChunks.X; x++)
			for (let y = 0; y < sizeInChunks.Y; y++)
				for (let z = 0; z < sizeInChunks.Z; z++)
					chunks[this.IndexFor(x, y, z, sizeInChunks)] = new BlockChunk<Block>(
						new Array(chunkSize.X * chunkSize.Y * chunkSize.Z),
						chunkSize,
						this.ChunkOffset(x, y, z, chunkSize, offset)
					)

		return new Region(
			size,
			chunkSize,
			offset,
			chunks,
			new EntityValues()
		)
	}

	static IndexFor(chunkX: number, chunkY: number, chunkZ: number, regionSizeInChunks: GridVector): number {
		return chunkX + chunkY * regionSizeInChunks.X + chunkZ * regionSizeInChunks.X * regionSizeInChunks.Y
	}

	static ChunkOffset(x: number, y: number, z: number, chunkSize: GridVector, regionOffset: GridVector): GridVector {
		return new Vector3(
			regionOffset.X + x * chunkSize.X,
			regionOffset.Y + y * chunkSize.Y,
			regionOffset.Z + z * chunkSize.Z
		)
	}
}

export class SerialisableRegion {
	constructor(
		public Version: Version,
		public Size: GridVector,
		public ChunkSize: GridVector,
		public Offset: GridVector,
		public Chunks: SerialisableBlockChunk[],
		public EntityValues: Map<Id, GroupedEntityValues>,
	) { }

	static fromDeserialised(source: any) { // TODO
		return new SerialisableRegion(
			new Version(
				new TypeMap(),
				new TypeMap(),
				new TypeMap(),
				new TypeMap()
			),
			new Vector3(0, 0, 0),
			new Vector3(0, 0, 0),
			new Vector3(0, 0, 0),
			source.Chunks.map(x => SerialisableBlockChunk.From(x)),
			SerialisableEntities.From(source.EntityValues)
		)
	}

	public static From(state: Region, config: GameConfig = null): SerialisableRegion {
		return new SerialisableRegion(
			new Version(
				config?.EntityTypeMap ?? new TypeMap(),
				config?.SolidTypeMap ?? new TypeMap(),
				config?.NonSolidTypeMap ?? new TypeMap(),
				config?.ItemTypeMap ?? new TypeMap()
			),
			state.Size,
			state.ChunkSize,
			state.Offset,
			state.Chunks.map(x => SerialisableBlockChunk.From(x)),
			SerialisableEntities.From(state.EntityValues)
		)
	}

	public ToRegionWithConfig(config: GameConfig): Region {
		if (this.Version.SimilarTo(config))
			return this.ToRegion()

		const entityMap = this.Version.GetEntityMapping(config)
		const solidMap = this.Version.GetSolidMapping(config)
		const nonSolidMap = this.Version.GetNonSolidMapping(config)
		//const itemMap = this.Version.GetItemMapping(config)

		const chunks = this.Chunks.map(x => x.ToBlockChunkWithMapping(solidMap, nonSolidMap))

		return new Region(
			this.Size,
			this.ChunkSize,
			this.Offset,
			chunks,
			SerialisableEntities.ToEntityValuesWithMapping(this.EntityValues, entityMap, solidMap, nonSolidMap)
		)
	}

	public ToRegion(): Region {
		const chunks = this.Chunks.map(x => x.ToBlockChunk())

		return new Region(
			this.Size,
			this.ChunkSize,
			this.Offset,
			chunks,
			SerialisableEntities.ToEntityValues(this.EntityValues)
		)
	}

	public RegionCoords = () => RegionCoordsFor(this.Offset.X, this.Offset.Y, this.Offset.Z, this.Size)
}

export class SerialisableBlockChunk {
	constructor(
		public Size: GridVector,
		public Offset: GridVector,
		public Blocks: Block[],
	) { }

	public ToBlockChunk(): BlockChunk<Block> {
		return new BlockChunk<Block>(
			[...this.Blocks],
			this.Size,
			this.Offset
		)
	}

	public ToBlockChunkWithMapping(solidMapping: Map<Id, Id>, nonSolidMapping: Map<Id, Id>): BlockChunk<Block> {
		return new BlockChunk<Block>(
			this.Blocks.map(x => this.MapBlock(x, solidMapping, nonSolidMapping)),
			this.Offset
		)
	}

	private MapBlock(block: Block, solidMapping: Map<Id, Id>, nonSolidMapping: Map<Id, Id>): Block {
		return Blocks.New(
			Blocks.TypeOf(block),
			solidMapping.get(Blocks.SolidOf(block)),
			nonSolidMapping.get(Blocks.NonSolidOf(block)),
			Blocks.VariantOf(block)
		)
	}

	public static From(chunk: BlockChunk<Block>): SerialisableBlockChunk {
		const size = new Vector3(chunk.ChunkSize.X, chunk.ChunkSize.Y, chunk.ChunkSize.Z)
		return new SerialisableBlockChunk(size, chunk.Offset, chunk.Blocks.slice())
	}
}