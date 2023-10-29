import { Id, Random, TerrainManager } from "@lundin/age"
import { BlockSurroundings, VariationProvider } from "../variation-provider"
import { Block, BlockType, Blocks } from "../state/block"
import { Region } from "../state/region"
import { Vector3 } from "@lundin/utility"

export class ChangeBlockService {
	constructor(
		private Terrain: TerrainManager<Block, Region>,
		private VariationProvider: VariationProvider,
		private Random: Random,
	) { }

	public PlaceBlock(position: Vector3, block: Id) {
		const currentBlock = this.Terrain.GetAt(position) ?? Blocks.NewEmpty(0)
		if (Blocks.TypeOf(currentBlock) === BlockType.Empty)
			this.SetBlock(position, Blocks.NewFloor(block, Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.SolidOf(currentBlock) !== block)
			this.SetBlock(position, Blocks.New(Blocks.TypeOf(currentBlock), block, Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) === BlockType.Floor)
			this.SetBlock(position, Blocks.NewHalf(block, Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) === BlockType.Half)
			this.SetBlock(position, Blocks.NewFull(block))
	}

	public DestroyBlock(position: Vector3, dropItem: boolean) {
		const currentBlock = this.Terrain.GetAt(position)
		if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.SetBlock(position, Blocks.NewEmpty(Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.SetBlock(position, Blocks.NewFloor(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Full)
			this.SetBlock(position, Blocks.NewHalf(Blocks.SolidOf(currentBlock), Blocks.NonSolidOf(currentBlock)))
		console.log(dropItem)//TODO: drop item
	}

	public SetBlock(position: Vector3, block: Id) {
		this.Terrain.SetAt(position, block)
		this.UpdateVariationsAround(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z))
	}

	public UpdateVariationsAround(x: number, y: number, z: number) {
		this.Terrain.Set(x, y, z, this.GetVariationFor(x, y, z))
		this.Terrain.Set(x - 1, y, z, this.GetVariationFor(x - 1, y, z))
		this.Terrain.Set(x, y - 1, z, this.GetVariationFor(x, y - 1, z))
		this.Terrain.Set(x + 1, y, z, this.GetVariationFor(x + 1, y, z))
		this.Terrain.Set(x, y + 1, z, this.GetVariationFor(x, y + 1, z))
	}

	public UpdateVariationsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number) {
		for (let x = minX; x < maxX; x++)
			for (let y = minY; y < maxY; y++)
				for (let z = minZ; z < maxZ; z++)
					this.Terrain.Set(x, y, z, this.GetVariationFor(x, y, z))
	}

	private GetVariationFor(x: number, y: number, z: number) {
		const block = this.Terrain.UpdatedAt(x, y, z)
		if (!this.VariationProvider.HasVariation(Blocks.SolidOf(block)))
			return block
		const surroundings = new BlockSurroundings(
			block,
			this.Terrain.UpdatedAt(x, y - 1, z),
			this.Terrain.UpdatedAt(x + 1, y, z),
			this.Terrain.UpdatedAt(x, y + 1, z),
			this.Terrain.UpdatedAt(x - 1, y, z),
		)
		const variation = this.VariationProvider.GetVariationFor(surroundings, this.Random.Float())
		return Blocks.WithVariation(block, variation)
	}
}
