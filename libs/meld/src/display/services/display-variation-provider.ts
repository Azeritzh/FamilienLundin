import { Blocks, SolidId } from "../../state/block"
import { BlockSurroundings, VariationProvider } from "../../variation-provider"
import { DisplayConfig } from "../state/display-config"

export class DisplayVariationProvider implements VariationProvider {
	constructor(private Config: DisplayConfig) { }

	HasVariation(solid: SolidId) {
		if (this.Config.BlockSprites.has(solid))
			return this.Config.BlockSprites.get(solid).length > 1
		return false
	}

	GetVariationFor(surroundings: BlockSurroundings, random: number) {
		const solid = Blocks.SolidOf(surroundings.Block)
		const sprites = this.Config.BlockSprites.get(solid)

		// TODO: actually consider the surroundings
		const sumOfWeights = sprites.map(x => x.Weight).sum()
		let sum = 0
		const randomNumber = sumOfWeights * random
		for (let i = 0; i < sprites.length; i++) {
			sum += sprites[i].Weight
			if (randomNumber < sum)
				return i
		}
		return 0
	}
}
