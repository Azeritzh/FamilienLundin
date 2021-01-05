import { MeldState } from "./meld-state"

export class Block { // struct
	constructor(
		public readonly blockType: BlockType,
		public readonly solidType: number,
		public readonly nonSolidType: number,
	) { }

	static newEmpty(nonSolidType: number) {
		return new Block(BlockType.Empty, 0, nonSolidType)
	}

	static newFloor(solidType: number, nonSolidType: number) {
		return new Block(BlockType.Floor, solidType, nonSolidType)
	}

	static newHalf(solidType: number, nonSolidType: number) {
		return new Block(BlockType.Half, solidType, nonSolidType)
	}

	static newFull(solidType: number) {
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

	hardness(state: MeldState) {
		state.terrain.solidBlockValues.hardnessValues[this.solidType]
			?? 1
	}
}

export enum BlockType { Empty, Floor, Half, Full }
