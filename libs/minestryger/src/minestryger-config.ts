export class MinestrygerConfig {
	constructor(
		public width: number,
		public height: number,
		public bombs: number,
	) {
		if (bombs >= width * height)
			this.bombs = width * height - 1
	}
}
