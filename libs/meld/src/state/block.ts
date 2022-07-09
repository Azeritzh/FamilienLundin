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

	serialise(): Id {
		return this.solidType | this.nonSolidType | (this.blockType.valueOf() << 28)
	}

	static deserialise(serialised: Id) {
		const solid = serialised & 0x0FFFFFFF // should probably eventually be 0x0000FFFF
		const nonSolid = serialised & 0x0FFF0000
		const type = serialised & 0xF0000000
		return new Block(
			type >> 28,
			solid,
			nonSolid
		)
	}
}

export enum BlockType { Empty = 0, Floor = 1, Half = 2, Full = 3 }
