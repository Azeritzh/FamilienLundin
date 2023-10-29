import { Blocks, SolidId } from "../../state/block"
import { BlockSurroundings, VariationProvider } from "../../variation-provider"
import { BlockSprites } from "../state/block-sprites"
import { DisplayConfig } from "../state/display-config"

export class DisplayVariationProvider implements VariationProvider {
	constructor(private Config: DisplayConfig) { }

	HasVariation(solid: SolidId) {
		if (this.Config.BlockSprites.has(solid))
			return this.Config.BlockSprites.get(solid).length > 1
		return false
	}

	GetVariationFor(surroundings: BlockSurroundings, random: number) {
		const allSprites = this.Config.BlockSprites.get(Blocks.SolidOf(surroundings.Block))

		surroundings.UpdateBorderInfo()
		const bestFit = allSprites
			.map(x => this.MatchingSides(surroundings, x))
			.max()
		const sprites = allSprites.filter(x => this.MatchingSides(surroundings, x) == bestFit)

		const sumOfWeights = sprites.map(x => x.Weight).sum()
		let sum = 0
		const randomNumber = sumOfWeights * random
		for (let i = 0; i < sprites.length; i++) {
			sum += sprites[i].Weight
			if (randomNumber < sum)
				return allSprites.indexOf(sprites[i])
		}
		return 0
	}

	public MatchingSides(surroundings: BlockSurroundings, sprite: BlockSprites) {
		let fitness = 0

		if (sprite.NorthBorder === null)
			fitness++
		else if (sprite.NorthBorder === surroundings.NorthBorder)
			fitness += 2

		if (sprite.EastBorder === null)
			fitness++
		else if (sprite.EastBorder === surroundings.EastBorder)
			fitness += 2

		if (sprite.SouthBorder === null)
			fitness++
		else if (sprite.SouthBorder === surroundings.SouthBorder)
			fitness += 2

		if (sprite.WestBorder === null)
			fitness++
		else if (sprite.WestBorder === surroundings.WestBorder)
			fitness += 2

		return fitness
	}
}
