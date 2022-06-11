import { Id } from "@lundin/age"

export class Block { // struct
	constructor(
		public readonly blockType: BlockType,
		public readonly solidType: Id,
		public readonly nonSolidType: Id,
	) { }

	static newEmpty(nonSolidType: Id) {
		return new Block(BlockType.Empty, 0, nonSolidType)
	}

	static newFloor(solidType: Id, nonSolidType: Id) {
		return new Block(BlockType.Floor, solidType, nonSolidType)
	}

	static newHalf(solidType: Id, nonSolidType: Id) {
		return new Block(BlockType.Half, solidType, nonSolidType)
	}

	static newFull(solidType: Id) {
		return new Block(BlockType.Full, solidType, 0)
	}

	hasSolid() {
		switch (this.blockType) {
			case BlockType.Floor:
			case BlockType.Half:
			case BlockType.Full:
				return true
			default:
				return false
		}
	}

	hasNonSolid() {
		switch (this.blockType) {
			case BlockType.Empty:
			case BlockType.Floor:
			case BlockType.Half:
				return true
			default:
				return false
		}
	}
}

export enum BlockType { Empty, Floor, Half, Full }
