import { Vector2 } from "@lundin/utility"
import { Random } from "../services/random"

export interface NoiseMap {
	ValueAt(point: Vector2): number
}

export class DoubleValleyNoiseMap implements NoiseMap {
	constructor(
		size: Vector2,
		numberOfPeaks: number,
		random: Random,
		private MapA = new PeakValleyNoiseMap(size, numberOfPeaks, random),
		private MapB = new PeakValleyNoiseMap(size, numberOfPeaks, random),
	) { }

	public ValueAt(point: Vector2) {
		return this.MapA.ValueAt(point) * 0.5 - this.MapB.ValueAt(point) * 0.5 + 0.5
	}
}

export class PeakValleyNoiseMap implements NoiseMap {
	constructor(
		private Size: Vector2,
		numberOfPeaks: number,
		random: Random,
		private Peaks = new TilingPoints(Size),
		private Valleys = new TilingPoints(Size),
	) {
		for (let i = 0; i < numberOfPeaks; i++)
			Peaks.Add(new Vector2(random.Float(Size.X), random.Float(Size.Y)))
		for (let i = 0; i < numberOfPeaks; i++)
			Valleys.Add(new Vector2(random.Float(Size.X), random.Float(Size.Y)))
	}

	public ValueAt(point: Vector2) {
		point = this.Size.Contain(point)
		const closestPeak = [...this.Peaks.PointsAround(point)].map(x => x.subtract(point).LengthSquared()).min()
		const closestValley = [...this.Valleys.PointsAround(point)].map(x => x.subtract(point).LengthSquared()).min()
		return closestPeak / (closestPeak + closestValley)
	}
}

export class TilingPoints {
	NorthWest: Vector2[] = []
	NorthEast: Vector2[] = []
	SouthEast: Vector2[] = []
	SouthWest: Vector2[] = []

	constructor(public Size: Vector2) { }

	public Add(point: Vector2) {
		const Size = this.Size
		if (point.X < Size.X / 2) {
			if (point.Y < Size.Y / 2)
				this.NorthWest.push(point)
			else
				this.SouthWest.push(point)
		}
		else {
			if (point.Y < Size.Y / 2)
				this.NorthEast.push(point)
			else
				this.SouthEast.push(point)
		}
	}

	public *PointsAround(position: Vector2) {
		const Size = this.Size
		const eastAdjustment = position.X < Size.X * 0.25
			? -Size.X
			: 0
		const westAdjustment = position.X > Size.X * 0.75
			? Size.X
			: 0
		const southAdjustment = position.Y < Size.Y * 0.25
			? -Size.Y
			: 0
		const northAdjustment = position.Y > Size.Y * 0.75
			? Size.Y
			: 0

		for (const point of this.NorthWest)
			yield point.add(new Vector2(westAdjustment, northAdjustment))
		for (const point of this.NorthEast)
			yield point.add(new Vector2(eastAdjustment, northAdjustment))
		for (const point of this.SouthEast)
			yield point.add(new Vector2(eastAdjustment, southAdjustment))
		for (const point of this.SouthWest)
			yield point.add(new Vector2(westAdjustment, southAdjustment))
	}
}
