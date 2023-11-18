import { TypeMap } from "@lundin/age"
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

	static From(sprites: SerialisableBlockSprites, solidTypeMap: TypeMap) {
		if (sprites.Block)
			return AutoBlockSpritesFrom(sprites, solidTypeMap, sprites.Block)
		return new BlockSprites(
			sprites.Weight ?? sprites.Weight ?? 1,
			sprites.NorthBorder ? solidTypeMap.TypeIdFor(sprites.NorthBorder) : null,
			sprites.EastBorder ? solidTypeMap.TypeIdFor(sprites.EastBorder) : null,
			sprites.SouthBorder ? solidTypeMap.TypeIdFor(sprites.SouthBorder) : null,
			sprites.WestBorder ? solidTypeMap.TypeIdFor(sprites.WestBorder) : null,
	
			sprites.TileNorth ?? sprites.StraightTile ?? "missing-sprite",
			sprites.TileNorthEast ?? sprites.DiagonalTile ?? "missing-sprite",
			sprites.TileEast ?? sprites.StraightTile ?? "missing-sprite",
			sprites.TileSouthEast ?? sprites.DiagonalTile ?? "missing-sprite",
			sprites.TileSouth ?? sprites.StraightTile ?? "missing-sprite",
			sprites.TileSouthWest ?? sprites.DiagonalTile ?? "missing-sprite",
			sprites.TileWest ?? sprites.StraightTile ?? "missing-sprite",
			sprites.TileNorthWest ?? sprites.DiagonalTile ?? "missing-sprite",
	
			sprites.FullWallNorth ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.FullWallNorthEast ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.FullWallEast ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.FullWallSouthEast ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.FullWallSouth ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.FullWallSouthWest ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.FullWallWest ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.FullWallNorthWest ?? sprites.DiagonalFullWall ?? "missing-sprite",
	
			sprites.HalfWallNorth ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.HalfWallNorthEast ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.HalfWallEast ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.HalfWallSouthEast ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.HalfWallSouth ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.HalfWallSouthWest ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite",
			sprites.HalfWallWest ?? sprites.StraightHalfWall ?? sprites.StraightFullWall ?? "missing-sprite",
			sprites.HalfWallNorthWest ?? sprites.DiagonalHalfWall ?? sprites.DiagonalFullWall ?? "missing-sprite"
		)
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

export interface SerialisableBlockSprites {
	Block?: string,
	Type?: string,

	Weight?: number,
	NorthBorder?: string,
	EastBorder?: string,
	SouthBorder?: string,
	WestBorder?: string,

	StraightTile?: string,
	StraightFullWall?: string,
	StraightHalfWall?: string,
	DiagonalTile?: string,
	DiagonalFullWall?: string,
	DiagonalHalfWall?: string,

	TileNorth?: string,
	TileNorthEast?: string,
	TileEast?: string,
	TileSouthEast?: string,
	TileSouth?: string,
	TileSouthWest?: string,
	TileWest?: string,
	TileNorthWest?: string,

	FullWallNorth?: string,
	FullWallNorthEast?: string,
	FullWallEast?: string,
	FullWallSouthEast?: string,
	FullWallSouth?: string,
	FullWallSouthWest?: string,
	FullWallWest?: string,
	FullWallNorthWest?: string,

	HalfWallNorth?: string,
	HalfWallNorthEast?: string,
	HalfWallEast?: string,
	HalfWallSouthEast?: string,
	HalfWallSouth?: string,
	HalfWallSouthWest?: string,
	HalfWallWest?: string,
	HalfWallNorthWest?: string,
}

function AutoBlockSpritesFrom(sprites: SerialisableBlockSprites, solidTypeMap: TypeMap, block: string) {
	const Type = sprites.Type
	sprites.Block = null
	sprites.Type = null
	sprites.StraightHalfWall = sprites.StraightHalfWall ?? block + "-half-wall-straight"
	sprites.StraightFullWall = sprites.StraightFullWall ?? block + "-full-wall-straight"
	sprites.DiagonalHalfWall = sprites.DiagonalHalfWall ?? block + "-half-wall-diagonal"
	sprites.DiagonalFullWall = sprites.DiagonalFullWall ?? block + "-full-wall-diagonal"
	if (Type == "default-block") {
		sprites.StraightTile = sprites.StraightTile ?? block + "-tile-straight"
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal"
	}
	if (Type == "default-north-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-top-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-left-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-bottom-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-right-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-east-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-right-" + sprites.EastBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-top-" + sprites.EastBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-left-" + sprites.EastBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-bottom-" + sprites.EastBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-south-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-bottom-" + sprites.SouthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-right-" + sprites.SouthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-top-" + sprites.SouthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-left-" + sprites.SouthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-left-" + sprites.WestBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-bottom-" + sprites.WestBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-right-" + sprites.WestBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-top-" + sprites.WestBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-east-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topright-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topleft-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-bottomleft-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-bottomright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topleft-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-bottomleft-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-bottomright-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-south-east-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-bottomright-" + sprites.SouthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topright-" + sprites.SouthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topleft-" + sprites.SouthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-bottomleft-" + sprites.SouthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-south-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-bottomleft-" + sprites.SouthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-bottomright-" + sprites.SouthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topright-" + sprites.SouthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topleft-" + sprites.SouthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-east-south-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-bottomleftright-" + sprites.SouthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topbottomright-" + sprites.SouthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topleftright-" + sprites.SouthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topbottomleft-" + sprites.SouthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-south-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topbottomleft-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-bottomleftright-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topbottomright-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topleftright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-east-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topleftright-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topbottomleft-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-bottomleftright-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topbottomright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-east-south-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topbottomright-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topleftright-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topbottomleft-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-bottomleftright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-east-south-west-border") {
		sprites.StraightTile = sprites.StraightTile ?? block + "-tile-straight-topbottomleftright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-north-south-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-topbottom-" + sprites.NorthBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-leftright-" + sprites.NorthBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-topbottom-" + sprites.NorthBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-leftright-" + sprites.NorthBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	if (Type == "default-east-west-border") {
		sprites.TileNorth = sprites.TileNorth ?? block + "-tile-straight-leftright-" + sprites.EastBorder
		sprites.TileEast = sprites.TileEast ?? block + "-tile-straight-topbottom-" + sprites.EastBorder
		sprites.TileSouth = sprites.TileSouth ?? block + "-tile-straight-leftright-" + sprites.EastBorder
		sprites.TileWest = sprites.TileWest ?? block + "-tile-straight-topbottom-" + sprites.EastBorder
		sprites.DiagonalTile = sprites.DiagonalTile ?? block + "-tile-diagonal" // TODO: diagonals
	}
	return BlockSprites.From(sprites, solidTypeMap)
}
