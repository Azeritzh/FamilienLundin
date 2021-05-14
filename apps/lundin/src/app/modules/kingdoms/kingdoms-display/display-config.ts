export class DisplayConfig {
	constructor(
		public gridThickness = 2,
		public gridColor = "black",
		
		public colorWaterHigh = "hsl(215deg 63% 58%)", // freshwater
		public colorWaterLow = "hsl(215deg 72% 38%)", // coastal
		public colorWaterNone = "hsl(215deg 82% 18%)", // deep ocean

		public colorFlatHigh = "hsl(130deg 93% 16%)", // forest
		public colorFlatLow = "hsl(71deg 90% 20%)", // plains
		public colorFlatNone = "hsl(49deg 95% 31%)", // desert

		public colorHillyHigh = "hsl(130deg 50% 30%)", // forest hills
		public colorHillyLow = "hsl(71deg 50% 35%)", // highlands
		public colorHillyNone = "hsl(49deg 50% 50%)", // desert hills

		public colorMountainousHigh = "hsl(130deg 30% 60%)", // forested mountains
		public colorMountainousLow = "hsl(71deg 40% 60%)", // mountains
		public colorMountainousNone = "hsl(49deg 20% 64%)", // bare mountains

		/* Colour for flat/hilly/mountainous, saturation+light for fertility
		public colorFlatHigh = "hsl(130deg 93% 16%)", // forest
		public colorFlatLow = "hsl(130deg 50% 30%)", // plains
		public colorFlatNone = "hsl(130deg 30% 60%)", // desert

		public colorHillyHigh = "hsl(71deg 90% 20%)", // forest hills
		public colorHillyLow = "hsl(71deg 50% 35%)", // highlands
		public colorHillyNone = "hsl(71deg 40% 60%)", // desert hills

		public colorMountainousHigh = "hsl(49deg 95% 31%)", // forested mountains
		public colorMountainousLow ="hsl(49deg 50% 50%)", // mountains
		public colorMountainousNone = "hsl(49deg 20% 64%)", // bare mountains
		*/

		/* Saturation+light for flat/hilly/mountainous, colour for fertility
		public colorFlatHigh = "hsl(130deg 93% 16%)", // forest
		public colorFlatLow = "hsl(71deg 90% 20%)", // plains
		public colorFlatNone = "hsl(49deg 95% 31%)", // desert

		public colorHillyHigh = "hsl(130deg 50% 30%)", // forest hills
		public colorHillyLow = "hsl(71deg 50% 35%)", // highlands
		public colorHillyNone = "hsl(49deg 50% 50%)", // desert hills

		public colorMountainousHigh = "hsl(130deg 30% 60%)", // forested mountains
		public colorMountainousLow = "hsl(71deg 40% 60%)", // mountains
		public colorMountainousNone = "hsl(49deg 20% 64%)", // bare mountains
		*/
	) { }
}