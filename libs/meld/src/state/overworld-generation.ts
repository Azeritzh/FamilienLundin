export class OverworldGeneration {
	constructor(
		public Biome: string,
		public NorthWestHeight: number,
		public NorthEastHeight: number,
		public SouthEastHeight: number,
		public SouthWestHeight: number,
		public NorthBlock: string,
		public EastBlock: string,
		public SouthBlock: string,
		public WestBlock: string,
	) { }
}