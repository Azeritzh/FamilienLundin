import { ViewDirection } from "./display-state"

export class BlockSprites {
	constructor(
		public Weight: number,
		public NorthBorder: number,
		public EastBorder: number,
		public SouthBorder: number,
		public WestBorder: number,

		public TileNorth: string,
		public TileNorthEast: string,
		public TileEast: string,
		public TileSouthEast: string,
		public TileSouth: string,
		public TileSouthWest: string,
		public TileWest: string,
		public TileNorthWest: string,

		public FullWallNorth: string,
		public FullWallNorthEast: string,
		public FullWallEast: string,
		public FullWallSouthEast: string,
		public FullWallSouth: string,
		public FullWallSouthWest: string,
		public FullWallWest: string,
		public FullWallNorthWest: string,

		public HalfWallNorth: string,
		public HalfWallNorthEast: string,
		public HalfWallEast: string,
		public HalfWallSouthEast: string,
		public HalfWallSouth: string,
		public HalfWallSouthWest: string,
		public HalfWallWest: string,
		public HalfWallNorthWest: string,
	) { }

	public TileFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.TileNorth
			case ViewDirection.NorthEast: return this.TileNorthEast
			case ViewDirection.East: return this.TileEast
			case ViewDirection.SouthEast: return this.TileSouthEast
			case ViewDirection.South: return this.TileSouth
			case ViewDirection.SouthWest: return this.TileSouthWest
			case ViewDirection.West: return this.TileWest
			case ViewDirection.NorthWest: return this.TileNorthWest
		}
	}

	public FullWallFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.FullWallNorth
			case ViewDirection.NorthEast: return this.FullWallNorthEast
			case ViewDirection.East: return this.FullWallEast
			case ViewDirection.SouthEast: return this.FullWallSouthEast
			case ViewDirection.South: return this.FullWallSouth
			case ViewDirection.SouthWest: return this.FullWallSouthWest
			case ViewDirection.West: return this.FullWallWest
			case ViewDirection.NorthWest: return this.FullWallNorthWest
		}
	}

	public HalfWallFor(direction: ViewDirection) {
		switch (direction) {
			case ViewDirection.North: return this.HalfWallNorth
			case ViewDirection.NorthEast: return this.HalfWallNorthEast
			case ViewDirection.East: return this.HalfWallEast
			case ViewDirection.SouthEast: return this.HalfWallSouthEast
			case ViewDirection.South: return this.HalfWallSouth
			case ViewDirection.SouthWest: return this.HalfWallSouthWest
			case ViewDirection.West: return this.HalfWallWest
			case ViewDirection.NorthWest: return this.HalfWallNorthWest
		}
	}
}

export class BlockTileOverlays {
	constructor(
		public TileOverlayTop = "default-tile-top",
		public TileOverlayBottom = "default-tile-bottom",
		public TileOverlayLeft = "default-tile-left",
		public TileOverlayRight = "default-tile-right",
		public TileOverlayTopLeft = "default-tile-top-left",
		public TileOverlayTopRight = "default-tile-top-right",
		public TileOverlayBottomLeft = "default-tile-bottom-left",
		public TileOverlayBottomRight = "default-tile-bottom-right"
	) { }
}

export class BlockWallOverlays {
	constructor(
		public StraightHalfWallOverlayLeft = "default-straight-half-wall-left",
		public StraightHalfWallOverlayRight = "default-straight-half-wall-right",
		public DiagonalHalfWallOverlayLeft = "default-diagonal-half-wall-left",
		public DiagonalHalfWallOverlayRight = "default-diagonal-half-wall-right",
		public StraightFullWallOverlayLeft = "default-straight-full-wall-left",
		public StraightFullWallOverlayRight = "default-straight-full-wall-right",
		public DiagonalFullWallOverlayLeft = "default-diagonal-full-wall-left",
		public DiagonalFullWallOverlayRight = "default-diagonal-full-wall-right"
	) { }
}
